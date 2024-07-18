import TiktokIcon from '@/components/tiktok-icon'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getInstagramProfileAndMedia } from '@/lib/api-helpers/instagram'
import { getTiktokProfileAndMedia } from '@/lib/api-helpers/tiktok'
import { auth } from '@/lib/auth'
import { getUrlType, getYoutubeThumbnailFromUrl } from '@/lib/utils'
import { refreshIntegrationAccessTokens } from '@/services/integration-tokens'
import { getUser } from '@/services/user'
import { format, formatDistanceToNow } from 'date-fns'
import { InferSelectModel } from 'drizzle-orm'
import {
    EyeIcon,
    InstagramIcon,
    LinkIcon,
    MessageCircleIcon,
    PlayIcon,
    RepeatIcon,
    XIcon,
    YoutubeIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import AddLinkForm from './add-link-form'
import ChangeImageDialog from './change-image-dialog'
import DeleteWidgetPopover from './delete-widget-popover'
import EditProfileDialog from './edit-profile-dialog'
import LogoutButton from './logout-button'
import PairAccountButton from './pair-account-button'
import { ThemeDropdown } from './theme-dropdown'