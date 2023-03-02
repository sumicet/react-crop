export async function getSize(src: string) {
    try {
        const image = new Image();
        image.src = src;
        const { width, height } = await new Promise<{ width: number; height: number }>(
            (resolve, reject) => {
                image.onload = () => {
                    resolve({ width: image.width, height: image.height });
                };
                image.onerror = reject;
            }
        );

        return { width, height };
    } catch (error) {
        return { width: null, height: null };
    }
}
