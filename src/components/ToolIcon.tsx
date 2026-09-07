import React from 'react';
import { 
  Layers, 
  Scissors, 
  LayoutGrid, 
  Minimize2, 
  Image as ImageIcon, 
  FileText, 
  Presentation, 
  FileSpreadsheet, 
  Code, 
  Stamp, 
  RotateCw, 
  PenTool, 
  Lock, 
  Unlock, 
  Binary, 
  ScanLine,
  HelpCircle
} from 'lucide-react';

interface ToolIconProps {
  iconName: string;
  className?: string;
  color?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ iconName, className = 'w-6 h-6', color }) => {
  const iconProps = { className, style: color ? { color } : undefined };

  switch (iconName) {
    case 'Layers':
      return <Layers {...iconProps} />;
    case 'Scissors':
      return <Scissors {...iconProps} />;
    case 'LayoutGrid':
      return <LayoutGrid {...iconProps} />;
    case 'Minimize2':
      return <Minimize2 {...iconProps} />;
    case 'Image':
      return <ImageIcon {...iconProps} />;
    case 'FileText':
      return <FileText {...iconProps} />;
    case 'Presentation':
      return <Presentation {...iconProps} />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet {...iconProps} />;
    case 'Code':
      return <Code {...iconProps} />;
    case 'Stamp':
      return <Stamp {...iconProps} />;
    case 'RotateCw':
      return <RotateCw {...iconProps} />;
    case 'PenTool':
      return <PenTool {...iconProps} />;
    case 'Lock':
      return <Lock {...iconProps} />;
    case 'Unlock':
      return <Unlock {...iconProps} />;
    case 'Binary':
      return <Binary {...iconProps} />;
    case 'ScanLine':
      return <ScanLine {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
};
