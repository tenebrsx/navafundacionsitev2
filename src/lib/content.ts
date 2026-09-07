import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { slugify } from "@/lib/slug";
import { plainExcerpt } from "@/lib/stripHtml";

export type CmsPost = {
    id: string;
    title: string;
    date: string;
    category: string;
    content?: string;
    excerpt?: string;
    image?: string;
    imageUrl?: string;
    author?: string;
    seoTitle?: string;
    seoDescription?: string;
    slug?: string;
    status?: string;
    featured?: boolean;
};

export type CmsEvent = {
    id: string;
    title: string;
    title_es?: string;
    date: string;
    description: string;
    description_es?: string;
    image?: string;
    startDate?: string;
    endDate?: string;
    type?: string;
    type_es?: string;
    artist?: string;
    location?: string;
    slug?: string;
    status?: string;
    featured?: boolean;
    seoTitle?: string;
    seoDescription?: string;
};

export type CmsProject = {
    id: string;
    title: string;
    type: string;
    year: string;
    description: string;
    content?: string;
    imageUrl?: string;
    image?: string;
    location?: string;
    images?: string[];
    slug?: string;
    status?: string;
    seoTitle?: string;
    seoDescription?: string;
};

export type CmsArtwork = {
    id: string;
    title: string;
    artist?: string;
    medium?: string;
    dimensions?: string;
    year?: string;
    description?: string;
    price?: string;
    priceOnRequest?: boolean;
    mainImage?: string;
    gallery?: string[];
    image?: string;
    imageUrl?: string;
    slug?: string;
    status?: string;
    seoTitle?: string;
    seoDescription?: string;
};

export type CmsTeamMember = {
    id: string;
    name: string;
    role?: string;
    bio?: string;
    image?: string;
    slug?: string;
    status?: string;
};

function mapDocs<T>(snap: Awaited<ReturnType<typeof getDocs>>): T[] {
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

function matchesParam(
    item: { id: string; slug?: string; title?: string; name?: string },
    param: string
): boolean {
    if (item.id === param) return true;
    if (item.slug && item.slug === param) return true;
    const fromTitle = slugify(item.title || item.name);
    return Boolean(fromTitle && fromTitle === param);
}

function isPublic(status?: string): boolean {
    // Treat missing status as public for legacy documents
    return !status || status === "published";
}

export async function getAllPosts(): Promise<CmsPost[]> {
    try {
        const snap = await getDocs(collection(db, "posts"));
        return mapDocs<CmsPost>(snap).filter((p) => isPublic(p.status));
    } catch (error) {
        console.error("getAllPosts:", error);
        return [];
    }
}

export async function getPostByParam(param: string): Promise<CmsPost | null> {
    try {
        const direct = await getDoc(doc(db, "posts", param));
        if (direct.exists()) {
            const post = { id: direct.id, ...direct.data() } as CmsPost;
            return isPublic(post.status) ? post : null;
        }
        const all = await getAllPosts();
        return all.find((p) => matchesParam(p, param)) || null;
    } catch (error) {
        console.error("getPostByParam:", error);
        return null;
    }
}

export async function getRelatedPosts(
    excludeId: string,
    limit = 3
): Promise<CmsPost[]> {
    const all = await getAllPosts();
    return all.filter((p) => p.id !== excludeId).slice(0, limit);
}

export async function getAllEvents(): Promise<CmsEvent[]> {
    try {
        const snap = await getDocs(collection(db, "events"));
        return mapDocs<CmsEvent>(snap).filter((e) => isPublic(e.status));
    } catch (error) {
        console.error("getAllEvents:", error);
        return [];
    }
}

export async function getEventByParam(param: string): Promise<CmsEvent | null> {
    try {
        const direct = await getDoc(doc(db, "events", param));
        if (direct.exists()) {
            const event = { id: direct.id, ...direct.data() } as CmsEvent;
            return isPublic(event.status) ? event : null;
        }
        const all = await getAllEvents();
        return all.find((e) => matchesParam(e, param)) || null;
    } catch (error) {
        console.error("getEventByParam:", error);
        return null;
    }
}

export async function getAllProjects(): Promise<CmsProject[]> {
    try {
        const snap = await getDocs(collection(db, "projects"));
        return mapDocs<CmsProject>(snap).filter((p) => isPublic(p.status));
    } catch (error) {
        console.error("getAllProjects:", error);
        return [];
    }
}

export async function getProjectByParam(
    param: string
): Promise<CmsProject | null> {
    try {
        const direct = await getDoc(doc(db, "projects", param));
        if (direct.exists()) {
            const project = { id: direct.id, ...direct.data() } as CmsProject;
            return isPublic(project.status) ? project : null;
        }
        const all = await getAllProjects();
        return all.find((p) => matchesParam(p, param)) || null;
    } catch (error) {
        console.error("getProjectByParam:", error);
        return null;
    }
}

export async function getAllArtworks(): Promise<CmsArtwork[]> {
    try {
        const snap = await getDocs(collection(db, "catalog"));
        return mapDocs<CmsArtwork>(snap).filter((a) => isPublic(a.status));
    } catch (error) {
        console.error("getAllArtworks:", error);
        return [];
    }
}

export async function getArtworkByParam(
    param: string
): Promise<CmsArtwork | null> {
    try {
        const direct = await getDoc(doc(db, "catalog", param));
        if (direct.exists()) {
            const artwork = { id: direct.id, ...direct.data() } as CmsArtwork;
            return isPublic(artwork.status) ? artwork : null;
        }
        const all = await getAllArtworks();
        return all.find((a) => matchesParam(a, param)) || null;
    } catch (error) {
        console.error("getArtworkByParam:", error);
        return null;
    }
}

export async function getAllTeam(): Promise<CmsTeamMember[]> {
    try {
        const snap = await getDocs(collection(db, "team"));
        return mapDocs<CmsTeamMember>(snap);
    } catch (error) {
        console.error("getAllTeam:", error);
        return [];
    }
}

/** Static path segment: prefer slug, else id. Also emit id when slug differs. */
export function pathParamsForItem(item: {
    id: string;
    slug?: string;
    title?: string;
    name?: string;
}): { id: string }[] {
    const preferred =
        item.slug || slugify(item.title || item.name) || item.id;
    const params = [{ id: preferred }];
    if (preferred !== item.id) params.push({ id: item.id });
    return params;
}

export function postSeoDescription(post: CmsPost): string {
    return (
        plainExcerpt(post.seoDescription, 160) ||
        plainExcerpt(post.excerpt, 160) ||
        plainExcerpt(post.content, 160) ||
        ""
    );
}

export function postSeoTitle(post: CmsPost): string {
    return (post.seoTitle || post.title || "").trim();
}

export function postImage(post: CmsPost): string | undefined {
    return post.image || post.imageUrl;
}
