<template>
  <component :is="iconComponent" :size="size" :class="className" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Search,
  X,
  Loader,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Building2,
  Building,
  UtensilsCrossed,
  Sliders,
  Bell,
  User,
  Settings,
  LogOut,
  LogIn,
  Heart,
  Sparkles,
  Calendar,
  Clock,
  Star,
  Info,
  Grid3X3,
  Check,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Globe,
  BookOpen,
  History,
  Landmark,
  Shield,
  MessageSquare,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  ArrowLeft,
  Palette,
  Sun,
  Moon,
  ShieldCheck,
  ShieldAlert,
  Key,
  Edit3,
  Navigation,
  Menu,
  Facebook,
  Twitter,
  Instagram,
  Eye,
  EyeOff,
  Plus,
  Minus
} from 'lucide-vue-next'

const Icons = {
  Search,
  X,
  Loader,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Building2,
  Building,
  UtensilsCrossed,
  Sliders,
  Bell,
  User,
  Settings,
  LogOut,
  LogIn,
  Heart,
  Sparkles,
  Calendar,
  Clock,
  Star,
  Info,
  Grid3X3,
  Check,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Globe,
  BookOpen,
  History,
  Landmark,
  Shield,
  MessageSquare,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  ArrowLeft,
  Palette,
  Sun,
  Moon,
  ShieldCheck,
  ShieldAlert,
  Key,
  Edit3,
  Navigation,
  Menu,
  Facebook,
  Twitter,
  Instagram,
  Eye,
  EyeOff,
  Plus,
  Minus
} as const

interface Props {
  name: keyof typeof Icons
  size?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
})

const iconComponent = computed(() => {
  return Icons[props.name] || Icons.AlertCircle
})

const className = computed(() => {
  return `w-[${props.size}px] h-[${props.size}px] ${props.class || ''}`
})
</script>
