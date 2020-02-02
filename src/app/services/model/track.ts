import { Artists } from './artist';

export interface Track {
    id: number;
    name: string;
    artists: Array<Artists>;
    uri: string;
    duration_ms: number;
    tempo: number;
    imgUrl: string;
}
