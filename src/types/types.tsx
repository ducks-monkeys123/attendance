import { Gathering } from "./enums";

export type User = {
    surname: string;
    first_name: string;
}

export type FormParameters = {
    form: string;
    first_name: string;
    surname: string;
    gathering: string;
    other_reason: string;
}

export type GatheringTimes = {
    type: Gathering;
    day: number;
    time: number;
    current: boolean;
}