interface IVA {
    analytics: {
        trackEvent(type: string, description?: string, id?: string): void;
    };
    navigate: {
        goBack(): void;
        goToSlide(slideId: string): void;
        goToNextSlide(): void;
        goToPrevSlide(): void;
        goLeft(): void;
        goRight(): void;
        goUp(): void;
        goDown(): void;
        goToChapter(chapterId: string): void;
        goToNextChapter(): void;
        goToPrevChapter(): void;
        goToSection(chapterId: string, sectionId: string): void;
        goToNextSection(): void;
        goToPrevSection(): void;
        getCurrentSlideId(): Promise<string | undefined>;
        getNextSlideId(): Promise<string | undefined>;
        getPreviousSlideId(): Promise<string | undefined>;
        getCurrentChapterId(): Promise<string | undefined>;
        getNextChapterId(): Promise<string | undefined>;
        getPreviousChapterId(): Promise<string | undefined>;
        getCurrentSectionId(): Promise<string | undefined>;
        getNextSectionId(): Promise<string | undefined>;
        getPreviousSectionId(): Promise<string | undefined>;
    };
}
declare const iva: IVA;
declare global {
    interface Window {
        iva: IVA;
    }
}

export { type IVA, iva };
