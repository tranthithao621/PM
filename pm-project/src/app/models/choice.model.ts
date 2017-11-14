import { Image } from './image.model'
import { ChoiceType } from './choice-type.model'

export class Choice {
    choiceId: number;
    choiceCode: string;
    choiceText: string;
    choiceCreUid: number;
    choiceCreTs: string;
    choiceLstUpdtUid: number;
    choiceLstUpdtTs: string;
    choiceType: ChoiceType[];
    images: Image[];
    checked: boolean;
}