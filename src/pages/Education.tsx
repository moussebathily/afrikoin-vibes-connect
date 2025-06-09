
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Video, 
  Award, 
  Users, 
  Clock, 
  Star,
  Play,
  Download,
  Globe,
  Mic
} from 'lucide-react';
import { Language } from '@/types/language';

interface EducationProps {
  language: Language;
}

const Education: React.FC<EducationProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState('courses');

  const text = {
    fr: {
      title: 'Université Numérique AfriKoin',
      subtitle: 'Apprenez, grandissez et excellez avec l\'Afrique',
      courses: 'Cours',
      languages: 'Langues',
      skills: 'Compétences',
      certifications: 'Certifications',
      myLearning: 'Mon apprentissage',
      popularCourses: 'Cours populaires',
      featuredCourses: 'Cours en vedette',
      duration: 'Durée',
      level: 'Niveau',
      students: 'Étudiants',
      rating: 'Note',
      startCourse: 'Commencer',
      continue: 'Continuer',
      certificate: 'Certificat',
      progress: 'Progression'
    },
    en: {
      title: 'AfriKoin Digital University',
      subtitle: 'Learn, grow and excel with Africa',
      courses: 'Courses',
      languages: 'Languages',
      skills: 'Skills',
      certifications: 'Certifications',
      myLearning: 'My Learning',
      popularCourses: 'Popular Courses',
      featuredCourses: 'Featured Courses',
      duration: 'Duration',
      level: 'Level',
      students: 'Students',
      rating: 'Rating',
      startCourse: 'Start',
      continue: 'Continue',
      certificate: 'Certificate',
      progress: 'Progress'
    }
  };

  const currentText = text[language] || text.fr;

  const courses = [
    {
      id: 1,
      title: 'E-commerce en Afrique : Guide Complet',
      instructor: 'Dr. Amina Touré',
      image: '/placeholder.svg',
      duration: '6 semaines',
      level: 'Intermédiaire',
      students: 2847,
      rating: 4.8,
      price: 'Gratuit',
      category: 'Business',
      progress: 0,
      description: 'Apprenez à créer et gérer un business e-commerce prospère en Afrique'
    },
    {
      id: 2,
      title: 'Langues Africaines : Swahili pour Débutants',
      instructor: 'Prof. Joseph Mwangi',
      image: '/placeholder.svg',
      duration: '8 semaines',
      level: 'Débutant',
      students: 5632,
      rating: 4.9,
      price: '25,000 FCFA',
      category: 'Langues',
      progress: 45,
      description: 'Maîtrisez les bases du Swahili, langue parlée par plus de 200 millions d\'Africains'
    },
    {
      id: 3,
      title: 'Fintech et Paiements Mobiles',
      instructor: 'Sarah Diallo',
      image: '/placeholder.svg',
      duration: '4 semaines',
      level: 'Avancé',
      students: 1245,
      rating: 4.7,
      price: '45,000 FCFA',
      category: 'Technologie',
      progress: 80,
      description: 'Découvrez l\'écosystème fintech africain et les innovations en paiements mobiles'
    },
    {
      id: 4,
      title: 'Agriculture Durable et Innovation',
      instructor: 'Dr. Kwame Asante',
      image: '/placeholder.svg',
      duration: '10 semaines',
      level: 'Intermédiaire',
      students: 3156,
      rating: 4.6,
      price: '35,000 FCFA',
      category: 'Agriculture',
      progress: 0,
      description: 'Techniques modernes pour une agriculture durable et productive en Afrique'
    }
  ];

  const languages = [
    {
      id: 1,
      name: 'Swahili',
      nativeName: 'Kiswahili',
      speakers: '200M+',
      difficulty: 'Facile',
      progress: 45,
      flag: '🇹🇿'
    },
    {
      id: 2,
      name: 'Hausa',
      nativeName: 'Harshen Hausa',
      speakers: '70M+',
      difficulty: 'Moyen',
      progress: 20,
      flag: '🇳🇬'
    },
    {
      id: 3,
      name: 'Amharique',
      nativeName: 'አማርኛ',
      speakers: '57M+',
      difficulty: 'Difficile',
      progress: 0,
      flag: '🇪🇹'
    },
    {
      id: 4,
      name: 'Yoruba',
      nativeName: 'Èdè Yorùbá',
      speakers: '45M+',
      difficulty: 'Moyen',
      progress: 0,
      flag: '🇳🇬'
    }
  ];

  const skillCategories = [
    {
      id: 1,
      name: 'Entrepreneuriat',
      icon: '💼',
      courses: 24,
      completionRate: 85
    },
    {
      id: 2,
      name: 'Technologies',
      icon: '💻',
      courses: 18,
      completionRate: 92
    },
    {
      id: 3,
      name: 'Agriculture',
      icon: '🌱',
      courses: 15,
      completionRate: 78
    },
    {
      id: 4,
      name: 'Finance',
      icon: '💰',
      courses: 12,
      completionRate: 88
    }
  ];

  const myCourses = courses.filter(course => course.progress > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{currentText.title}</h1>
          <p className="text-xl opacity-90 mb-8">{currentText.subtitle}</p>
          <div className="flex justify-center gap-4">
            <Button variant="secondary" size="lg">
              Parcourir les cours
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary" size="lg">
              Devenir instructeur
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="text-2xl font-bold">150+</h3>
            <p className="text-sm text-muted-foreground">Cours disponibles</p>
          </Card>
          <Card className="p-6 text-center">
            <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
            <h3 className="text-2xl font-bold">25K+</h3>
            <p className="text-sm text-muted-foreground">Étudiants actifs</p>
          </Card>
          <Card className="p-6 text-center">
            <Award className="w-8 h-8 text-accent mx-auto mb-2" />
            <h3 className="text-2xl font-bold">50+</h3>
            <p className="text-sm text-muted-foreground">Instructeurs experts</p>
          </Card>
          <Card className="p-6 text-center">
            <Globe className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold">54</h3>
            <p className="text-sm text-muted-foreground">Pays couverts</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="courses">{currentText.courses}</TabsTrigger>
            <TabsTrigger value="languages">{currentText.languages}</TabsTrigger>
            <TabsTrigger value="skills">{currentText.skills}</TabsTrigger>
            <TabsTrigger value="certifications">{currentText.certifications}</TabsTrigger>
            <TabsTrigger value="mylearning">{currentText.myLearning}</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-6">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">{currentText.featuredCourses}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {courses.map(course => (
                    <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img 
                          src={course.image} 
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className="absolute top-2 left-2">
                          {course.category}
                        </Badge>
                        <Button
                          size="icon"
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 text-primary hover:bg-white"
                        >
                          <Play className="w-5 h-5" />
                        </Button>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">par {course.instructor}</p>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {course.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {course.students.toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              {course.rating}
                            </div>
                            <Badge variant="outline">{course.level}</Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">{course.price}</span>
                          <Button size="sm">
                            {course.progress > 0 ? currentText.continue : currentText.startCourse}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="languages" className="mt-6">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Langues Africaines</h2>
                <p className="text-muted-foreground mb-8">
                  Connectez-vous avec l'Afrique en apprenant ses langues riches et diversifiées
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {languages.map(lang => (
                  <Card key={lang.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{lang.flag}</span>
                        <div>
                          <h3 className="text-xl font-semibold">{lang.name}</h3>
                          <p className="text-muted-foreground">{lang.nativeName}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{lang.difficulty}</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Locuteurs natifs</span>
                        <span className="font-medium">{lang.speakers}</span>
                      </div>
                      
                      {lang.progress > 0 && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{currentText.progress}</span>
                            <span className="font-medium">{lang.progress}%</span>
                          </div>
                          <Progress value={lang.progress} className="h-2" />
                        </div>
                      )}
                      
                      <Button className="w-full" variant={lang.progress > 0 ? "default" : "outline"}>
                        <Mic className="w-4 h-4 mr-2" />
                        {lang.progress > 0 ? currentText.continue : 'Commencer l\'apprentissage'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Développement des Compétences</h2>
                <p className="text-muted-foreground mb-8">
                  Acquérez les compétences essentielles pour réussir dans l'économie africaine moderne
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {skillCategories.map(category => (
                  <Card key={category.id} className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {category.courses} cours disponibles
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Taux de réussite</span>
                        <span>{category.completionRate}%</span>
                      </div>
                      <Progress value={category.completionRate} className="h-1" />
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      Explorer
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="mt-6">
            <Card className="p-8">
              <div className="text-center py-12">
                <Award className="w-20 h-20 text-primary mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">Certifications Professionnelles</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Obtenez des certifications reconnues qui valorisent vos compétences sur le marché du travail africain
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🏆</div>
                    <h3 className="font-semibold">Certifié Reconnu</h3>
                    <p className="text-sm text-muted-foreground">Par les entreprises africaines</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🌍</div>
                    <h3 className="font-semibold">Valable Partout</h3>
                    <p className="text-sm text-muted-foreground">Dans toute l'Afrique</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">⚡</div>
                    <h3 className="font-semibold">Mise à Jour Continue</h3>
                    <p className="text-sm text-muted-foreground">Formations régulières</p>
                  </div>
                </div>
                <Button size="lg">Découvrir les certifications</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="mylearning" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{currentText.myLearning}</h2>
                <Button variant="outline">Voir tout</Button>
              </div>
              
              {myCourses.length > 0 ? (
                <div className="grid gap-6">
                  {myCourses.map(course => (
                    <Card key={course.id} className="p-6">
                      <div className="flex items-start gap-4">
                        <img 
                          src={course.image} 
                          alt={course.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{course.title}</h3>
                            <Badge>{course.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">par {course.instructor}</p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span>{currentText.progress}</span>
                              <span className="font-medium">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          
                          <div className="flex gap-2">
                            <Button>
                              {course.progress === 100 ? 'Revoir' : currentText.continue}
                            </Button>
                            {course.progress === 100 && (
                              <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                {currentText.certificate}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8">
                  <div className="text-center py-8">
                    <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Aucun cours en cours</h3>
                    <p className="text-muted-foreground mb-6">
                      Commencez votre parcours d'apprentissage dès aujourd'hui
                    </p>
                    <Button>Parcourir les cours</Button>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Education;
