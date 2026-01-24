export interface Blueprint {
    id: string;
    label: string;
    description: string;
    data: any;
}

export const BLUEPRINTS: Blueprint[] = [
    {
        id: "standard",
        label: "Standard Page",
        description: "A flexible layout with a Hero Header and Text content.",
        data: {
            blocks: [
                {
                    id: "hero",
                    type: "hero",
                    data: {
                        image: "", // Empty for setup
                        title: "New Page Title",
                        subtitle: "Add a subtitle..."
                    }
                },
                {
                    id: "content-1",
                    type: "text",
                    data: {
                        body: "Start writing your content here. You can add more blocks below."
                    }
                }
            ]
        }
    },
    {
        id: "gallery",
        label: "Visual Gallery",
        description: "Image-focused layout for exhibitions or portfolios.",
        data: {
            blocks: [
                {
                    id: "hero",
                    type: "hero",
                    data: {
                        title: "Gallery Name",
                        subtitle: "Curated Selection"
                    }
                },
                {
                    id: "gallery-1",
                    type: "text",
                    data: { body: "Gallery Block Placeholder (Coming Soon)" }
                }
            ]
        }
    },
    {
        id: "blank",
        label: "Blank Canvas",
        description: "Start from scratch with an empty page.",
        data: {
            blocks: [
                {
                    id: "hero",
                    type: "hero",
                    data: {
                        title: "Untitled"
                    }
                }
            ]
        }
    }
];
