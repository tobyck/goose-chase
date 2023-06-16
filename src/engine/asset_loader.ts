/* 
 * engine/asset_loader.ts
 *
 * This contains the code which handles the loading of all assets (images and
 * audio) synchronously so that the game can only start after all assets have
 * been loaded.
 */

// type for the actual asset
export type Asset = HTMLImageElement | HTMLAudioElement;

export type Assets = {
    images: HTMLImageElement[];
    audio: HTMLAudioElement[];
}

// enum so that an actual value can be attached to the asset
export enum AssetType {
    Image,
    Audio
}

// object which contains information about the asset
export interface AssetSource {
    type: AssetType;
    path: string;
}

export class AssetLoader {
    #sources: AssetSource[] = []; // private because it's not (and shouldn't be) accessible from outside

    constructor(sources: AssetSource[]) {
        this.#sources = sources;
    }

    // create a promise for a single asset
    private static loadAsset(asset: AssetSource): Promise<Asset> {
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

    // function which loads all assets from this.#sources
    async loadAll(): Promise<Assets> {
        // get promises for all assets
        const promises = this.#sources.map(AssetLoader.loadAsset);

        // wait for all to load
        const assets = await Promise.all(promises);

        // return all assets in an object which is split into images and audio
        return {
            images: assets.filter(asset => asset instanceof HTMLImageElement) as HTMLImageElement[],
            audio: assets.filter(asset => asset instanceof HTMLAudioElement) as HTMLAudioElement[]
        };
    }
}