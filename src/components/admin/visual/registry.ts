import HeroBlock from "@/components/blocks/HeroBlock";
import TextBlock from "@/components/blocks/TextBlock";
import SplitContentBlock from "@/components/blocks/SplitContentBlock";
import GalleryBlock from "@/components/blocks/GalleryBlock";
import SmartHeroBlock from "@/components/blocks/SmartHeroBlock";

export const BLOCK_REGISTRY: Record<string, any> = {
    smart_hero: {
        label: "Smart Hero (Auto Events)",
        component: SmartHeroBlock,
        schema: {
            fallbackTitle: { type: "text", label: "Fallback Title" },
            fallbackSubtitle: { type: "text", label: "Fallback Subtitle" },
            fallbackImage: { type: "image", label: "Fallback Image" }
        },
        defaultData: {
            fallbackTitle: "Nava Foundation",
            fallbackSubtitle: "Supporting Arts & Culture"
        }
    },
    hero: {
        label: "Hero Banner",
        component: HeroBlock,
        schema: {
            image: { type: "image", label: "Background Image" },
            title: { type: "text", label: "Title" },
            subtitle: { type: "textarea", label: "Subtitle" },
            category: { type: "text", label: "Category Label" }
        },
        defaultData: {
            title: "Hero Title",
            subtitle: "Subtitle goes here...",
            category: "Exhibit"
        }
    },
    text: {
        label: "Rich Text",
        component: TextBlock,
        schema: {
            title: { type: "text", label: "Section Title (Optional)" },
            content: { type: "textarea", label: "Content Body" },
            alignment: { type: "text", label: "Alignment (left/center/right)" }, // Could be select if we added that type, sticking to text for now
            width: { type: "text", label: "Width (narrow/medium/full)" }
        },
        defaultData: {
            content: "Write your content here...",
            alignment: "left",
            width: "medium"
        }
    },
    split: {
        label: "Split Content (Image/Text)",
        component: SplitContentBlock,
        schema: {
            image: { type: "image", label: "Image" },
            title: { type: "text", label: "Title" },
            caption: { type: "text", label: "Small Caption" },
            body: { type: "textarea", label: "Body Text" },
            layout: { type: "text", label: "Layout (image-left / image-right)" }
        },
        defaultData: {
            title: "Split Section",
            layout: "image-left"
        }
    },
    gallery: {
        label: "Image Gallery (3)",
        component: GalleryBlock,
        schema: {
            title: { type: "text", label: "Gallery Title" },
            image1: { type: "image", label: "Image 1" },
            caption1: { type: "text", label: "Caption 1" },
            image2: { type: "image", label: "Image 2" },
            caption2: { type: "text", label: "Caption 2" },
            image3: { type: "image", label: "Image 3" },
            caption3: { type: "text", label: "Caption 3" },
        },
        defaultData: {
            title: "Gallery"
        }
    }
};
