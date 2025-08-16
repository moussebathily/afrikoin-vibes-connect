import React from "react";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { changeLanguage, languages } from "@/i18n/config";

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = async (languageCode: string) => {
    await changeLanguage(languageCode);
  };

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-auto px-2">
          <Globe className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">
            {currentLanguage?.code.toUpperCase() || "EN"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 max-h-96 overflow-y-auto bg-background/95 backdrop-blur-sm border z-[100]"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent ${
              i18n.language === language.code ? "bg-accent" : ""
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium text-sm">{language.nativeName}</span>
              <span className="text-xs text-muted-foreground">
                {language.name}
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {language.code}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
