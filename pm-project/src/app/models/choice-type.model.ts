import { Choice } from './choice.model'
export class ChoiceType {
    choiceTypeId: number;
    choiceTypeCode: string;
    choiceTypeAbb: string;
    choiceTypeDes: string;
    choiceTypeParent: number;
    choiceTypeCreUid: number;
    choiceTypeCreTs: string;
    choiceTypeLstUpdtUid: number;
    choiceTypeLstUpdtTs: string;
    checked: boolean;
    checkparent: string;
    choices: Choice[];
}