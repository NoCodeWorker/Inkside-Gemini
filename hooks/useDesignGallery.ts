import { useState, useCallback } from 'react';
import { collection, query, orderBy, getDocs, limit, startAfter, getCountFromServer, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { SavedDesign } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from './useNotifications';
import { useTranslations } from '../i18n/useTranslations';

const PAGE_SIZE = 16;

export const useDesignGallery = () => {
  const { user } = useAuth();
  const { t } = useTranslations();
  const { showNotification } = useNotifications();
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  
  // Store the cursor for the START of each page. pageCursors[0] is always null.
  const [pageCursors, setPageCursors] = useState<(QueryDocumentSnapshot<DocumentData> | null)[]>([null]);

  const fetchDesigns = useCallback(async (page: number) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const designsCollectionRef = collection(db, 'users', user.uid, 'designs');
      
      // Get total count on first load
      if (page === 1 && totalPages === 0) {
        const countSnapshot = await getCountFromServer(designsCollectionRef);
        const totalDesigns = countSnapshot.data().count;
        const totalP = Math.ceil(totalDesigns / PAGE_SIZE);
        setTotalPages(totalP > 0 ? totalP : 1);
      }
      
      const cursor = pageCursors[page - 1];
      let q;
      if (cursor) {
        q = query(designsCollectionRef, orderBy('createdAt', 'desc'), startAfter(cursor), limit(PAGE_SIZE));
      } else {
        q = query(designsCollectionRef, orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
      }

      const querySnapshot = await getDocs(q);
      const newDesigns = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedDesign));
      setDesigns(newDesigns);
      
      if (querySnapshot.docs.length > 0) {
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        if (page >= pageCursors.length) {
          setPageCursors(prev => [...prev, lastVisible]);
        }
      }
      setCurrentPage(page);

    } catch (e) {
      console.error("Error fetching designs:", e);
      showNotification('Failed to load designs.');
    } finally {
      setIsLoading(false);
    }
  }, [user, pageCursors, totalPages, showNotification]);
  
  const handleDownloadAll = async () => {
      if (!user) return;
      setIsDownloadingAll(true);
      try {
        const designsCollectionRef = collection(db, 'users', user.uid, 'designs');
        const q = query(designsCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const allDesigns = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedDesign));

        for (const design of allDesigns) {
          try {
            const response = await fetch(design.imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `inkside_design_${design.id}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            await new Promise(resolve => setTimeout(resolve, 300));
          } catch (downloadError) {
            console.error(`Failed to download design ${design.id}:`, downloadError);
          }
        }
      } catch (fetchError) {
        console.error("Error fetching all designs for download:", fetchError);
        showNotification(t('errors.ui.downloadAllFailed'));
      } finally {
        setIsDownloadingAll(false);
      }
  };

  return {
    designs,
    isLoading,
    isDownloadingAll,
    currentPage,
    totalPages,
    fetchDesigns,
    handleDownloadAll,
  };
};