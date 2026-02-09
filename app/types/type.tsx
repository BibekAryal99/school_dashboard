export type SummaryCardProps = {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
};

export type Props = {
  data: SummaryCardProps[];
};

export interface Params {
  params: {
    id: string;
  };
}

export interface Item {
  id: number;
}
