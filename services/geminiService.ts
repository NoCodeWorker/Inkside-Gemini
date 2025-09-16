import { GoogleGenAI, Modality } from "@google/genai";
import { TattooStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const styleMap: Record<TattooStyle, string> = {
  [TattooStyle.TSHIRT_DESIGN]: 'Modern T-Shirt Graphic Design',
  [TattooStyle.REALISM]: 'Hyper-realistic Tattoo Style',
  [TattooStyle.TRADITIONAL]: 'American Traditional Tattoo Style',
  [TattooStyle.NEO_TRADITIONAL]: 'Neo-Traditional Tattoo Style',
  [TattooStyle.JAPANESE]: 'Japanese (Irezumi) Tattoo Style',
  [TattooStyle.TRIBAL]: 'Tribal / Polynesian Tattoo Style',
  [TattooStyle.BLACKWORK]: 'Blackwork Tattoo Style',
  [TattooStyle.GEOMETRIC]: 'Geometric Tattoo Style',
  [TattooStyle.WATERCOLOR]: 'Watercolor Tattoo Style',
  [TattooStyle.MINIMALIST]: 'Minimalist / Fine Line Tattoo Style',
  [TattooStyle.SKETCH]: 'Sketch style Tattoo',
  [TattooStyle.ANIME_MANGA]: 'Anime / Manga Tattoo Style',
  [TattooStyle.BIOMECHANICAL]: 'Biomechanical Tattoo Style',
  [TattooStyle.LETTERING]: 'Lettering Tattoo Style',
};

function handleGeminiError(error: unknown, defaultMessageKey: string): Error {
    console.error("Error con la API de Gemini:", error);
    const apiError = error as any;
    let message = apiError?.message || defaultMessageKey;

    try {
        const parsed = JSON.parse(message);
        if (parsed?.error?.status === 'RESOURCE_EXHAUSTED' || parsed?.error?.code === 429) {
            return new Error('errors.api.resourceExhausted');
        }
    } catch(e) {
        // Not a JSON message, fall through
    }

    if (typeof message === 'string' && message.startsWith('{')) {
        return new Error(defaultMessageKey);
    }
    
    return new Error(message);
}

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

interface BaseDesignParams {
  mainElement: string;
  style: TattooStyle;
  colorPalette?: string;
  supportingElements?: string;
  mood?: string;
  composition?: string;
  textToInclude?: string;
  elementsToAvoid?: string;
  referenceSketch?: File | null;
}

interface TattooDesignParams extends BaseDesignParams {
  bodyPart?: string;
  sizeComplexity?: string;
}

interface TshirtDesignParams extends BaseDesignParams {
  tshirtColor?: string;
  tshirtPlacement?: string;
}

async function generateDetailedPrompt(promptTemplate: string, referenceSketch: File | null): Promise<string> {
    try {
        const parts: ({ text: string } | { inlineData: { data: string; mimeType: string } })[] = [{ text: promptTemplate }];
        if (referenceSketch) {
            const sketchPart = await fileToGenerativePart(referenceSketch);
            parts.unshift(sketchPart);
        }
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: parts },
            config: {
                maxOutputTokens: 250, // Constrain the prompt length
                thinkingConfig: { thinkingBudget: 0 } // faster, less complex prompt generation
            }
        });
        return response.text;
    } catch (error) {
        throw handleGeminiError(error, "errors.api.promptGenerationFailed");
    }
}

const CRITICAL_RULES = {
  COMPOSITION: `
    **CRITICAL RULE: COMPOSITION MUST BE A COMPLETE, FINISHED PIECE OF ART.** The design must have a justified and coherent end. It must NEVER look like a cropped illustration or a abruptly cut-off image. Every element must be fully visible and intentionally placed within the frame, creating a complete and balanced artwork. The design must be self-contained.
  `,
  NO_TEXT: `
    **CRITICAL RULE: The final image must contain absolutely NO text, letters, words, numbers, characters, fonts, typography, signatures, watermarks, or any form of writing unless specifically requested by the user.** This is a visual design only. Do not add any descriptive or metadata text onto the image itself.
  `
};

export async function generateTshirtDesign(params: TshirtDesignParams): Promise<string> {
  const { 
    mainElement, style, tshirtColor, tshirtPlacement, colorPalette, 
    supportingElements, mood, composition, textToInclude, 
    elementsToAvoid, referenceSketch 
  } = params;

  const textForAnalysis = `
    As an expert art director, create a highly detailed, single-paragraph image prompt in English for an image generation AI. This prompt will be used to create a professional, print-ready graphic for a t-shirt.
    The user might write in Spanish or English; understand both and synthesize all requirements into a cohesive artistic description.

    ${CRITICAL_RULES.COMPOSITION}
    
    **Core Concept:**
    - Style: ${styleMap[style]}
    - Main Subject: ${mainElement}

    **Placement and Context:**
    - T-Shirt Color (for context): ${tshirtColor || 'not specified, assume neutral'}
    - Design Placement on Back: ${tshirtPlacement || 'large and centered'}

    **Artistic Details:**
    - Color Palette: ${colorPalette || 'artist\'s choice based on style'}. If a palette is specified, the AI must strictly adhere to only those colors.
    - Supporting Elements: ${supportingElements || 'none'}
    - Mood & Emotion: ${mood || 'not specified'}
    - Composition: ${composition || 'balanced composition'}

    **Specific Inclusions/Exclusions:**
    - Text or Symbols to Include: ${textToInclude || 'none'}
    - Elements to Avoid: ${elementsToAvoid || 'none'}.
  
    The final generated prompt must be very descriptive, focusing on high-impact visuals, clean edges, and a composition that works well on apparel. If a reference sketch is provided, analyze its visual elements and merge them into the description.
  `;
  
  let finalImagePrompt = await generateDetailedPrompt(textForAnalysis, referenceSketch);
  finalImagePrompt += `. The final design must be a high-quality, print-ready graphic with a transparent background.`;
  
  finalImagePrompt += CRITICAL_RULES.NO_TEXT;
  if (elementsToAvoid?.trim()) {
    finalImagePrompt += ` Specifically, do not include any of the following: '${elementsToAvoid.trim()}'.`;
  }
  
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: finalImagePrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '3:4', // Corrected aspect ratio for t-shirts
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    } else {
      throw new Error("errors.api.noImageReturned");
    }
  } catch (error) {
    throw handleGeminiError(error, "errors.api.imageGenerationFailed");
  }
}

export async function generateTattooDesign(params: TattooDesignParams): Promise<string> {
  const { 
    mainElement, style, bodyPart, sizeComplexity, colorPalette, 
    supportingElements, mood, composition, textToInclude, 
    elementsToAvoid, referenceSketch 
  } = params;
  
  const textForAnalysis = `
    As an expert tattoo designer, create a highly detailed, single-paragraph image prompt in English for an image generation AI. This prompt will create a professional, "tattooable" design.
    The user might write in Spanish or English; understand both and synthesize all requirements into a cohesive artistic description.

    ${CRITICAL_RULES.COMPOSITION}

    **Tattooability Rules (CRITICAL):**
    - The design must be technically sound for tattooing. This means clean, confident linework (varying line weights are a plus), clear and readable shading (stippling, black packing, or smooth gradients), and avoidance of microscopic details that would blur on skin over time.
    - The composition must respect and flow with the specified body part, as if designed by a real tattoo artist.

    **Core Concept:**
    - Style: ${styleMap[style]}
    - Main Subject: ${mainElement}

    **Placement and Scale:**
    - Body Part: ${bodyPart || 'not specified, assume a flat surface'}
    - Size and Complexity: ${sizeComplexity || 'standard tattoo size, moderate detail'}

    **Artistic Details:**
    - Color Palette: ${colorPalette || 'artist\'s choice based on style'}. If a palette is specified, the AI must strictly adhere to only those colors.
    - Supporting Elements: ${supportingElements || 'none'}
    - Mood & Emotion: ${mood || 'not specified'}
    - Composition: ${composition || 'balanced composition that flows with the body part'}

    **Specific Inclusions/Exclusions:**
    - Text or Symbols to Include: ${textToInclude || 'none'}
    - Elements to Avoid: ${elementsToAvoid || 'none'}.
    
    The final generated prompt must be very descriptive. If a reference sketch is provided, analyze its visual elements and merge them into the description.
  `;
  
  let finalImagePrompt = await generateDetailedPrompt(textForAnalysis, referenceSketch);
  finalImagePrompt += `. The final design must be clean, with high contrast and sharp lines suitable for a real tattoo. The background must be transparent.`;

  finalImagePrompt += CRITICAL_RULES.NO_TEXT;
  if (elementsToAvoid?.trim()) {
    finalImagePrompt += ` Specifically, do not include any of the following: '${elementsToAvoid.trim()}'.`;
  }

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: finalImagePrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    } else {
      throw new Error("errors.api.noImageReturned");
    }
  } catch (error) {
    throw handleGeminiError(error, "errors.api.imageGenerationFailed");
  }
}

export async function generateFrontShield(base64ImageData: string): Promise<string> {
  const prompt = `
    Analyze this main graphic. Create a simplified, complementary emblem based on its core themes, style, and colors. This new design is for the front chest of a t-shirt (like a pocket logo).
    **CRITICAL RULES:**
    - It must be visually cohesive with the main design but much simpler.
    - **It must be a complete, standalone design, not a cropped piece of the original.**
    - Do not place it inside a literal shield or crest shape unless the original design's style demands it.
    - The final image must be a clean graphic with a transparent background, in PNG format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: 'image/png',
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    throw new Error("errors.api.noStencilReturned");

  } catch (error) {
    throw handleGeminiError(error, "errors.api.stencilGenerationFailed");
  }
}

export async function generateStencil(base64ImageData: string): Promise<string> {
  const prompt = `
    Create a professional, high-fidelity tattoo stencil from this design, ready for a thermal printer.
    **CRITICAL TECHNICAL RULES:**
    1.  **Outlines:** All outlines must be converted to crisp, solid black lines. The linework must be clean and unbroken.
    2.  **Shading:**
        - **Smooth gradients** must be translated into clean stippling (dot work). The density of the dots should represent the darkness of the gradient.
        - **Solid dark areas** should be translated into solid black fills.
    3.  **Clarity:** The final stencil must be high contrast, with only black artwork on a transparent background. It should clearly define all lines and shading areas for a tattoo artist to follow perfectly. This is not a simple outline trace; it's a technical conversion of a full design into a usable tattoo stencil.
    The final image must be in PNG format with a transparent background.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: 'image/png',
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    throw new Error("errors.api.noStencilReturned");

  } catch (error) {
    throw handleGeminiError(error, "errors.api.stencilGenerationFailed");
  }
}
