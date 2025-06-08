
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
      orangeDesc: 'Le leader du mobile money en Afrique de l\'Ouest',
      wave: 'Wave',
      waveDesc: 'Transferts rapides et gratuits',
      mtnMomo: 'MTN Mobile Money',
      mtnDesc: 'Solution de paiement mobile MTN',
      airtelMoney: 'Airtel Money',
      airtelDesc: 'Paiements mobiles Airtel',
      mpesa: 'M-Pesa',
      mpesaDesc: 'Leader du mobile money en Afrique de l\'Est',
      tigoCash: 'Tigo Cash',
      tigoDesc: 'Solution Tigo pour l\'Afrique de l\'Est',
      ecocash: 'EcoCash',
      ecocashDesc: 'Mobile money Zimbabwe',
      tcash: 'T-Cash',
      tcashDesc: 'Solution Tigo pour l\'Afrique de l\'Ouest',
      flooz: 'Flooz',
      floozDesc: 'Paiement mobile Togo',
      stripe: 'Cartes bancaires',
      stripeDesc: 'Visa, Mastercard, et plus',
      paypal: 'PayPal',
      paypalDesc: 'Paiements internationaux sécurisés',
      moovMoney: 'Moov Money',
      moovDesc: 'Solution mobile Côte d\'Ivoire',
      security: 'Sécurité garantie',
      securityDesc: 'Toutes les transactions sont cryptées et protégées',
      fees: 'Frais réduits',
      feesDesc: 'Les meilleurs tarifs du marché'
    },
    en: {
      title: 'Secure payments',
      subtitle: 'Pay with your preferred solutions, anywhere in Africa',
      orangeMoney: 'Orange Money',
      orangeDesc: 'West Africa\'s mobile money leader',
      wave: 'Wave',
      waveDesc: 'Fast and free transfers',
      mtnMomo: 'MTN Mobile Money',
      mtnDesc: 'MTN mobile payment solution',
      airtelMoney: 'Airtel Money',
      airtelDesc: 'Airtel mobile payments',
      mpesa: 'M-Pesa',
      mpesaDesc: 'East Africa\'s mobile money leader',
      tigoCash: 'Tigo Cash',
      tigoDesc: 'Tigo solution for East Africa',
      ecocash: 'EcoCash',
      ecocashDesc: 'Zimbabwe mobile money',
      tcash: 'T-Cash',
      tcashDesc: 'Tigo solution for West Africa',
      flooz: 'Flooz',
      floozDesc: 'Togo mobile payment',
      stripe: 'Bank cards',
      stripeDesc: 'Visa, Mastercard, and more',
      paypal: 'PayPal',
      paypalDesc: 'Secure international payments',
      moovMoney: 'Moov Money',
      moovDesc: 'Ivory Coast mobile solution',
      security: 'Guaranteed security',
      securityDesc: 'All transactions are encrypted and protected',
      fees: 'Reduced fees',
      feesDesc: 'The best rates on the market'
    },
    bm: {
      title: 'Saranni lakananen',
      subtitle: 'I ɲɛnajɛ fura ye i b\'a fɛ cogo min na, Afrika bɛɛ la',
      orangeMoney: 'Orange Money',
      orangeDesc: 'Mobile money ɲɛmɔgɔ Afrika Tlebi la',
      wave: 'Wave',
      waveDesc: 'Teliya ani wɔɔrɔba',
      mtnMomo: 'MTN Mobile Money',
      mtnDesc: 'MTN mobile saranni',
      airtelMoney: 'Airtel Money',
      airtelDesc: 'Airtel mobile saranni',
      mpesa: 'M-Pesa',
      mpesaDesc: 'Mobile money ɲɛmɔgɔ Afrika Kɔrɔn la',
      tigoCash: 'Tigo Cash',
      tigoDesc: 'Tigo fura Afrika Kɔrɔn ma',
      ecocash: 'EcoCash',
      ecocashDesc: 'Zimbabwe mobile money',
      tcash: 'T-Cash',
      tcashDesc: 'Tigo fura Afrika Tlebi ma',
      flooz: 'Flooz',
      floozDesc: 'Togo mobile saranni',
      stripe: 'Banki karti',
      stripeDesc: 'Visa, Mastercard, ani tɔw',
      paypal: 'PayPal',
      paypalDesc: 'Diɲɛ saranni lakananen',
      moovMoney: 'Moov Money',
      moovDesc: 'Côte d\'Ivoire mobile fura',
      security: 'Lakana',
      securityDesc: 'Saranni bɛɛ dabɔra ani tanga',
      fees: 'Sara dɔgɔ',
      feesDesc: 'Sugu ɲuman'
    },
    ar: {
      title: 'مدفوعات آمنة',
      subtitle: 'ادفع بالحلول المفضلة لديك في جميع أنحاء أفريقيا',
      orangeMoney: 'أورانج موني',
      orangeDesc: 'رائد الأموال المحمولة في غرب أفريقيا',
      wave: 'ويف',
      waveDesc: 'تحويلات سريعة ومجانية',
      mtnMomo: 'MTN موبايل موني',
      mtnDesc: 'حل الدفع المحمول من MTN',
      airtelMoney: 'إيرتل موني',
      airtelDesc: 'مدفوعات إيرتل المحمولة',
      mpesa: 'M-Pesa',
      mpesaDesc: 'رائد الأموال المحمولة في شرق أفريقيا',
      tigoCash: 'تيجو كاش',
      tigoDesc: 'حل تيجو لشرق أفريقيا',
      ecocash: 'إيكو كاش',
      ecocashDesc: 'الأموال المحمولة في زيمبابوي',
      tcash: 'T-Cash',
      tcashDesc: 'حل تيجو لغرب أفريقيا',
      flooz: 'فلووز',
      floozDesc: 'الدفع المحمول في توجو',
      stripe: 'البطاقات المصرفية',
      stripeDesc: 'فيزا، ماستركارد، والمزيد',
      paypal: 'باي بال',
      paypalDesc: 'مدفوعات دولية آمنة',
      moovMoney: 'موف موني',
      moovDesc: 'الحل المحمول لساحل العاج',
      security: 'أمان مضمون',
      securityDesc: 'جميع المعاملات مشفرة ومحمية',
      fees: 'رسوم مخفضة',
      feesDesc: 'أفضل الأسعار في السوق'
    },
    ti: {
      title: 'ውሑስ ክፍሊት',
      subtitle: 'ኣብ ምሉእ ኣፍሪቃ ብዝደለኹሞ ኣገባብ ክፈሉ',
      orangeMoney: 'Orange Money',
      orangeDesc: 'ናይ ምዕራብ ኣፍሪቃ ሞባይል ገንዘብ መራሒ',
      wave: 'Wave',
      waveDesc: 'ቅልጡፍን ነጻን ምልውዋጥ',
      mtnMomo: 'MTN Mobile Money',
      mtnDesc: 'ናይ MTN ሞባይል ክፍሊት',
      airtelMoney: 'Airtel Money',
      airtelDesc: 'ናይ Airtel ሞባይል ክፍሊት',
      mpesa: 'M-Pesa',
      mpesaDesc: 'ናይ ምብራቕ ኣፍሪቃ ሞባይል ገንዘብ መራሒ',
      tigoCash: 'Tigo Cash',
      tigoDesc: 'ናይ ምብራቕ ኣፍሪቃ Tigo መፍትሒ',
      ecocash: 'EcoCash',
      ecocashDesc: 'ናይ ዚምባብዌ ሞባይል ገንዘብ',
      tcash: 'T-Cash',
      tcashDesc: 'ናይ ምዕራብ ኣፍሪቃ Tigo መፍትሒ',
      flooz: 'Flooz',
      floozDesc: 'ናይ ቶጎ ሞባይል ክፍሊት',
      stripe: 'ናይ ባንክ ካርድ',
      stripeDesc: 'Visa, Mastercard, ከምኡውን ካልእ',
      paypal: 'PayPal',
      paypalDesc: 'ውሑስ ሃገራዊ ክፍሊት',
      moovMoney: 'Moov Money',
      moovDesc: 'ናይ ኮት ዲቯር ሞባይል መፍትሒ',
      security: 'ውሑስነት',
      securityDesc: 'ኩሉ ንግዲ ተሸፊኑን ተሓጊዙን',
      fees: 'ዝተወሰነ ክፍሊት',
      feesDesc: 'ኣብ ዕዳጋ ዝሓሸ ዋጋ'
    },
    pt: {
      title: 'Pagamentos seguros',
      subtitle: 'Pague com suas soluções preferidas, em toda a África',
      orangeMoney: 'Orange Money',
      orangeDesc: 'Líder em dinheiro móvel na África Ocidental',
      wave: 'Wave',
      waveDesc: 'Transferências rápidas e gratuitas',
      mtnMomo: 'MTN Mobile Money',
      mtnDesc: 'Solução de pagamento móvel MTN',
      airtelMoney: 'Airtel Money',
      airtelDesc: 'Pagamentos móveis Airtel',
      mpesa: 'M-Pesa',
      mpesaDesc: 'Líder em dinheiro móvel na África Oriental',
      tigoCash: 'Tigo Cash',
      tigoDesc: 'Solução Tigo para África Oriental',
      ecocash: 'EcoCash',
      ecocashDesc: 'Dinheiro móvel do Zimbábue',
      tcash: 'T-Cash',
      tcashDesc: 'Solução Tigo para África Ocidental',
      flooz: 'Flooz',
      floozDesc: 'Pagamento móvel do Togo',
      stripe: 'Cartões bancários',
      stripeDesc: 'Visa, Mastercard e mais',
      paypal: 'PayPal',
      paypalDesc: 'Pagamentos internacionais seguros',
      moovMoney: 'Moov Money',
      moovDesc: 'Solução móvel da Costa do Marfim',
      security: 'Segurança garantida',
      securityDesc: 'Todas as transações são criptografadas e protegidas',
      fees: 'Taxas reduzidas',
      feesDesc: 'As melhores tarifas do mercado'
    },
    es: {
      title: 'Pagos seguros',
      subtitle: 'Paga con tus soluciones preferidas, en toda África',
      orangeMoney: 'Orange Money',
      orangeDesc: 'Líder en dinero móvil de África Occidental',
      wave: 'Wave',
      waveDesc: 'Transferencias rápidas y gratuitas',
      mtnMomo: 'MTN Mobile Money',
      mtnDesc: 'Solución de pago móvil MTN',
      airtelMoney: 'Airtel Money',
      airtelDesc: 'Pagos móviles Airtel',
      mpesa: 'M-Pesa',
      mpesaDesc: 'Líder en dinero móvil de África Oriental',
      tigoCash: 'Tigo Cash',
      tigoDesc: 'Solución Tigo para África Oriental',
      ecocash: 'EcoCash',
      ecocashDesc: 'Dinero móvil de Zimbabue',
      tcash: 'T-Cash',
      tcashDesc: 'Solución Tigo para África Occidental',
      flooz: 'Flooz',
      floozDesc: 'Pago móvil de Togo',
      stripe: 'Tarjetas bancarias',
      stripeDesc: 'Visa, Mastercard y más',
      paypal: 'PayPal',
      paypalDesc: 'Pagos internacionales seguros',
      moovMoney: 'Moov Money',
      moovDesc: 'Solución móvil de Costa de Marfil',
      security: 'Seguridad garantizada',
      securityDesc: 'Todas las transacciones están encriptadas y protegidas',
      fees: 'Tarifas reducidas',
      feesDesc: 'Las mejores tarifas del mercado'
    },
    zh: {
      title: '安全支付',
      subtitle: '在整个非洲使用您首选的支付方式',
      orangeMoney: 'Orange Money',
      orangeDesc: '西非移动支付领导者',
      wave: 'Wave',
      waveDesc: '快速免费转账',
      mtnMomo: 'MTN Mobile Money',
      mtnDesc: 'MTN移动支付解决方案',
      airtelMoney: 'Airtel Money',
      airtelDesc: 'Airtel移动支付',
      mpesa: 'M-Pesa',
      mpesaDesc: '东非移动支付领导者',
      tigoCash: 'Tigo Cash',
      tigoDesc: '东非Tigo解决方案',
      ecocash: 'EcoCash',
      ecocashDesc: '津巴布韦移动支付',
      tcash: 'T-Cash',
      tcashDesc: '西非Tigo解决方案',
      flooz: 'Flooz',
      floozDesc: '多哥移动支付',
      stripe: '银行卡',
      stripeDesc: 'Visa、Mastercard等',
      paypal: 'PayPal',
      paypalDesc: '安全的国际支付',
      moovMoney: 'Moov Money',
      moovDesc: '科特迪瓦移动解决方案',
      security: '安全保障',
      securityDesc: '所有交易都经过加密和保护',
      fees: '费用减免',
      feesDesc: '市场最优价格'
    },
    ru: {
      title: 'Безопасные платежи',
      subtitle: 'Платите предпочитаемыми способами по всей Африке',
      orangeMoney: 'Orange Money',
      orangeDesc: 'Лидер мобильных денег в Западной Африке',
      wave: 'Wave',
      waveDesc: 'Быстрые и бесплатные переводы',
      mtnMomo: 'MTN Mobile Money',
      mtnDesc: 'Решение мобильных платежей MTN',
      airtelMoney: 'Airtel Money',
      airtelDesc: 'Мобильные платежи Airtel',
      mpesa: 'M-Pesa',
      mpesaDesc: 'Лидер мобильных денег в Восточной Африке',
      tigoCash: 'Tigo Cash',
      tigoDesc: 'Решение Tigo для Восточной Африки',
      ecocash: 'EcoCash',
      ecocashDesc: 'Мобильные деньги Зимбабве',
      tcash: 'T-Cash',
      tcashDesc: 'Решение Tigo для Западной Африки',
      flooz: 'Flooz',
      floozDesc: 'Мобильные платежи Того',
      stripe: 'Банковские карты',
      stripeDesc: 'Visa, Mastercard и другие',
      paypal: 'PayPal',
      paypalDesc: 'Безопасные международные платежи',
      moovMoney: 'Moov Money',
      moovDesc: 'Мобильное решение Кот-д\'Ивуара',
      security: 'Гарантированная безопасность',
      securityDesc: 'Все транзакции зашифрованы и защищены',
      fees: 'Сниженные комиссии',
      feesDesc: 'Лучшие тарифы на рынке'
    },
    hi: {
      title: 'सुरक्षित भुगतान',
      subtitle: 'पूरे अफ्रीका में अपने पसंदीदा तरीकों से भुगतान करें',
      orangeMoney: 'Orange Money',
      orangeDesc: 'पश्चिम अफ्रीका का मोबाइल मनी लीडर',
      wave: 'Wave',
      waveDesc: 'तेज़ और मुफ्त ट्रांसफर',
      mtnMomo: 'MTN Mobile Money',
      mtnDesc: 'MTN मोबाइल भुगतान समाधान',
      airtelMoney: 'Airtel Money',
      airtelDesc: 'Airtel मोबाइल भुगतान',
      mpesa: 'M-Pesa',
      mpesaDesc: 'पूर्वी अफ्रीका का मोबाइल मनी लीडर',
      tigoCash: 'Tigo Cash',
      tigoDesc: 'पूर्वी अफ्रीका के लिए Tigo समाधान',
      ecocash: 'EcoCash',
      ecocashDesc: 'जिम्बाब्वे मोबाइल मनी',
      tcash: 'T-Cash',
      tcashDesc: 'पश्चिम अफ्रीका के लिए Tigo समाधान',
      flooz: 'Flooz',
      floozDesc: 'टोगो मोबाइल भुगतान',
      stripe: 'बैंक कार्ड',
      stripeDesc: 'Visa, Mastercard, और अधिक',
      paypal: 'PayPal',
      paypalDesc: 'सुरक्षित अंतर्राष्ट्रीय भुगतान',
      moovMoney: 'Moov Money',
      moovDesc: 'आइवरी कोस्ट मोबाइल समाधान',
      security: 'गारंटीशुदा सुरक्षा',
      securityDesc: 'सभी लेनदेन एन्क्रिप्टेड और सुरक्षित हैं',
      fees: 'कम शुल्क',
      feesDesc: 'बाजार में सबसे अच्छी दरें'
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
      name: currentText.mtnMomo,
      description: currentText.mtnDesc,
      color: 'from-yellow-500 to-yellow-600',
      logo: '💛'
    },
    {
      name: currentText.airtelMoney,
      description: currentText.airtelDesc,
      color: 'from-red-500 to-red-600',
      logo: '❤️'
    },
    {
      name: currentText.mpesa,
      description: currentText.mpesaDesc,
      color: 'from-green-500 to-green-600',
      logo: '💚'
    },
    {
      name: currentText.wave,
      description: currentText.waveDesc,
      color: 'from-blue-500 to-blue-600',
      logo: '🌊'
    },
    {
      name: currentText.tigoCash,
      description: currentText.tigoDesc,
      color: 'from-indigo-500 to-indigo-600',
      logo: '💙'
    },
    {
      name: currentText.ecocash,
      description: currentText.ecocashDesc,
      color: 'from-emerald-500 to-emerald-600',
      logo: '🟢'
    },
    {
      name: currentText.tcash,
      description: currentText.tcashDesc,
      color: 'from-cyan-500 to-cyan-600',
      logo: '🔵'
    },
    {
      name: currentText.flooz,
      description: currentText.floozDesc,
      color: 'from-teal-500 to-teal-600',
      logo: '💎'
    },
    {
      name: currentText.moovMoney,
      description: currentText.moovDesc,
      color: 'from-pink-500 to-pink-600',
      logo: '💗'
    },
    {
      name: currentText.stripe,
      description: currentText.stripeDesc,
      color: 'from-purple-500 to-purple-600',
      logo: '💳'
    },
    {
      name: currentText.paypal,
      description: currentText.paypalDesc,
      color: 'from-blue-600 to-blue-700',
      logo: '🌐'
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
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
