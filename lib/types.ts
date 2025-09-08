
export type ResponseOption = 'yes' | 'no' | 'na';

export interface ChecklistItem {
  itemNumber: number;
  response?: ResponseOption;
  comments?: string;
}

export interface HeaderInfo {
  completedBy: string;
  building: string;
  supervisor: string;
  department: string;
  date: string;
  room: string;
  phone: string;
}

export interface InspectionData {
  id?: string;
  headerInfo: HeaderInfo;
  generalSafety: ChecklistItem[];
  fireSafety: ChecklistItem[];
  isCompleted: boolean;
  isDraft: boolean;
}

export interface InspectionFormProps {
  onSubmit: (data: InspectionData, isDraft: boolean) => Promise<void>;
  initialData?: Partial<InspectionData>;
}
