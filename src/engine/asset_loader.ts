export enum AssetType {
    Image,
    Audio
}

export interface AssetSource {
    type: AssetType;
    path: string;
}

export class AssetLoader {
    #sources: AssetSource[] = [];
    assets: {
        images: HTMLImageElement[];
        audio: HTMLAudioElement[];
    };

    constructor(sources: AssetSource[]) {
        this.#sources = sources;
    }

    // create a promise for a single asset
    private static loadAsset(asset: AssetSource): Promise<any> {
        return new Promise((resolve, reject) => {
            if (asset.type === AssetType.Image) {
                const image = new Image();
                image.src = asset.path;
                image.onload = () => resolve(image);
                image.onerror = reject;
            } else if (asset.type === AssetType.Audio) {
                const audio = new Audio();
                audio.src = asset.path;
                audio.oncanplaythrough = () => resolve(audio);
                audio.onerror = reject;
            }
        });
    }

    // return a promise with an object containing all image and audio assets
    loadAll(): Promise<typeof this.assets> {
        return new Promise((resolve, reject) => {
            const promises = this.#sources.map(AssetLoader.loadAsset);
            Promise.all(promises).then(assets => {
                this.assets = {
                    images: assets.filter(asset => asset instanceof HTMLImageElement),
                    audio: assets.filter(asset => asset instanceof HTMLAudioElement)
                };
                resolve(this.assets);
            }).catch(reject);
        });
    }
}