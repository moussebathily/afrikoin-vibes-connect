import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Calendar, 
  Star, 
  BadgeCheck, 
  Edit, 
  Share2,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SellerProfileProps {
  storeName: string;
  storeDescription?: string;
  logoUrl?: string;
  bannerUrl?: string;
  businessType?: string;
  country?: string;
  city?: string;
  phone?: string;
  email?: string;
  website?: string;
  isVerified?: boolean;
  rating: number;
  totalReviews: number;
  joinedAt: string;
  isOwner?: boolean;
  onEdit?: () => void;
}

export function SellerProfile({
  storeName,
  storeDescription,
  logoUrl,
  bannerUrl,
  businessType,
  country,
  city,
  phone,
  email,
  website,
  isVerified,
  rating,
  totalReviews,
  joinedAt,
  isOwner,
  onEdit
}: SellerProfileProps) {
  return (
    <Card className="overflow-hidden">
      {/* Banner */}
      <div 
        className="h-32 md:h-48 bg-gradient-to-r from-primary/20 to-accent/20 relative"
        style={bannerUrl ? { 
          backgroundImage: `url(${bannerUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <CardContent className="relative -mt-16 pb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          {/* Logo/Avatar */}
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage src={logoUrl} alt={storeName} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
              {storeName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Store Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">{storeName}</h1>
              {isVerified && (
                <BadgeCheck className="h-6 w-6 text-primary fill-primary/20" />
              )}
              <Badge variant="secondary" className="capitalize">
                {businessType === 'business' ? 'Entreprise' : 'Particulier'}
              </Badge>
            </div>

            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
              {(city || country) && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {city && country ? `${city}, ${country}` : city || country}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Membre depuis {format(new Date(joinedAt), 'MMMM yyyy', { locale: fr })}
              </span>
            </div>

            <div className="flex items-center gap-1 mt-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({totalReviews} avis)</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {isOwner ? (
              <Button onClick={onEdit} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            )}
          </div>
        </div>

        {/* Description */}
        {storeDescription && (
          <p className="mt-4 text-muted-foreground">{storeDescription}</p>
        )}

        {/* Contact Info */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="h-4 w-4" />
              {phone}
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="h-4 w-4" />
              {email}
            </a>
          )}
          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <Globe className="h-4 w-4" />
              Site web
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
