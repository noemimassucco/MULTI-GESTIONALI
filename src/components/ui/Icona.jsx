import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Blocks,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  Database,
  FileSpreadsheet,
  FileStack,
  FolderOpen,
  GraduationCap,
  HardHat,
  HeartHandshake,
  House,
  LayoutGrid,
  Layers,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquare,
  Package,
  PartyPopper,
  Phone,
  Play,
  PlayCircle,
  RefreshCw,
  ScanLine,
  Scale,
  Search,
  Send,
  Settings2,
  Shapes,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Truck,
  Upload,
  UserCog,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";

/**
 * Registro delle icone usate nel sito.
 * Elenco esplicito invece di import dinamico: il bundle resta piccolo
 * e un nome sbagliato si nota subito perché l'icona non compare.
 */
const registro = {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Blocks,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  Database,
  FileSpreadsheet,
  FileStack,
  FolderOpen,
  GraduationCap,
  HardHat,
  HeartHandshake,
  House,
  LayoutGrid,
  Layers,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquare,
  Package,
  PartyPopper,
  Phone,
  Play,
  PlayCircle,
  RefreshCw,
  ScanLine,
  Scale,
  Search,
  Send,
  Settings2,
  Shapes,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Truck,
  Upload,
  UserCog,
  Users,
  Wrench,
  X,
  Zap,
};

/**
 * Icona del sistema.
 * Tre misure ammesse — sm 16, md 20, lg 24 — e un solo spessore di tratto,
 * cosi le icone non ballano da una sezione all'altra.
 */
const misure = { sm: "size-4", md: "size-5", lg: "size-6" };

export default function Icona({ nome, misura = "md", className = "" }) {
  const Componente = registro[nome] || Shapes;
  return (
    <Componente
      className={`${misure[misura] || misure.md} ${className}`}
      strokeWidth={1.75}
      aria-hidden="true"
    />
  );
}
