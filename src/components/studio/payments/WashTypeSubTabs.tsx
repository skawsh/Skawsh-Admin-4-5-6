
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WashTypeSubTabsProps {
  value: string;
  onChange: (value: string) => void;
}

const WashTypeSubTabs: React.FC<WashTypeSubTabsProps> = ({
  value,
  onChange
}) => {
  return (
    <Tabs value={value} onValueChange={onChange} className="mt-4 mb-6">
      <TabsList>
        <TabsTrigger value="all">All Wash Types</TabsTrigger>
        <TabsTrigger value="standard">Standard Wash Type</TabsTrigger>
        <TabsTrigger value="express">Express Wash Type</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default WashTypeSubTabs;
