<template>
  <component :is="iconComponent" :size="size" :class="className" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed, h, defineComponent } from 'vue'
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
  Minus,
  Mountain,
  Flower2,
  IndianRupee,
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  UserPlus,
  Users,
  Share,
  Share2,
  Grid,
  Grid3x3,
  Compass
} from 'lucide-vue-next'

// Custom Mandir Icon
const Mandir = defineComponent({
  name: 'Mandir',
  props: {
    size: { type: [Number, String], default: 24 },
    strokeWidth: { type: [Number, String], default: 2 }
  },
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: this.size,
        height: this.size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': this.strokeWidth,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        class: 'lucide lucide-mandir'
      },
      [
        h('path', { d: 'M3 21h18' }),
        h('path', { d: 'M5 21v-3h14v3' }),
        h('path', { d: 'M7 18l5-12 5 12' }),
        h('path', { d: 'M9 14h6' }),
        h('path', { d: 'M11 10h2' }),
        h('path', { d: 'M12 6V3' }),
        h('path', { d: 'M12 3l2 1-2 1' })
      ]
    )
  }
})

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
  Minus,
  Mountain,
  Flower2,
  Mandir,
  IndianRupee,
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  UserPlus,
  Users,
  Share,
  Share2,
  Grid,
  Grid3x3,
  Compass
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
