
import React from 'react';
import { Card } from '@/components/ui/card';
import { CreditCard, Shield } from 'lucide-react';
import { Language } from '@/types/language';

interface PaymentOptionsProps {
  language: Language;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ language }) => {
  const text = {
    fr: {
      title: 'Paiements sécurisés',
      subtitle: 'Payez avec vos solutions préférées, partout en Afrique',
      orangeMoney: 'Orange Money',
      orangeDesc: 'Le leader du mobile money en Afrique',
      wave: 'Wave',
      waveDesc: 'Transferts rapides et gratuits',
      stripe: 'Cartes bancaires',
      stripeDesc: 'Visa, Mastercard, et plus',
      security: 'Sécurité garantie',
      securityDesc: 'Toutes les transactions sont cryptées et protégées',
      fees: 'Frais réduits',
      feesDesc: 'Les meilleurs tarifs du marché'
    },
    en: {
      title: 'Secure payments',
      subtitle: 'Pay with your preferred solutions, anywhere in Africa',
      orangeMoney: 'Orange Money',
      orangeDesc: 'Africa\'s mobile money leader',
      wave: 'Wave',
      waveDesc: 'Fast and free transfers',
      stripe: 'Bank cards',
      stripeDesc: 'Visa, Mastercard, and more',
      security: 'Guaranteed security',
      securityDesc: 'All transactions are encrypted and protected',
      fees: 'Reduced fees',
      feesDesc: 'The best rates on the market'
    }
  };

  const currentText = text[language] || text.fr;

  const paymentMethods = [
    {
      name: currentText.orangeMoney,
      description: currentText.orangeDesc,
      color: 'from-orange-500 to-orange-600',
      logo: '🧡'
    },
    {
      name: currentText.wave,
      description: currentText.waveDesc,
      color: 'from-blue-500 to-blue-600',
      logo: '🌊'
    },
    {
      name: currentText.stripe,
      description: currentText.stripeDesc,
      color: 'from-purple-500 to-purple-600',
      logo: '💳'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: currentText.security,
      description: currentText.securityDesc
    },
    {
      icon: CreditCard,
      title: currentText.fees,
      description: currentText.feesDesc
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {currentText.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentText.subtitle}
          </p>
        </div>

        {/* Méthodes de paiement */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {paymentMethods.map((method, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl`}>
                {method.logo}
              </div>
              <h3 className="font-semibold text-lg mb-2">{method.name}</h3>
              <p className="text-sm text-muted-foreground">{method.description}</p>
            </Card>
          ))}
        </div>

        {/* Fonctionnalités de sécurité */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaymentOptions;
