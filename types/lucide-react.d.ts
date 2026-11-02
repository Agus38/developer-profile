declare module "lucide-react" {
  import type { ComponentType, SVGProps } from "react";

  type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number; color?: string }>;

  export const ArrowDown: IconComponent;
  export const ArrowDownRight: IconComponent;
  export const ArrowLeft: IconComponent;
  export const ArrowUp: IconComponent;
  export const ArrowUpRight: IconComponent;
  export const Braces: IconComponent;
  export const Check: IconComponent;
  export const Command: IconComponent;
  export const Github: IconComponent;
  export const Layers3: IconComponent;
  export const Linkedin: IconComponent;
  export const Moon: IconComponent;
  export const MoveUpRight: IconComponent;
  export const Search: IconComponent;
  export const Send: IconComponent;
  export const Sun: IconComponent;
  export const Wrench: IconComponent;
}
