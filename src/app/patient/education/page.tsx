'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Heart,
  ArrowRight,
  Loader2,
  X
} from 'lucide-react';
import { mockEducationContent, EducationContent } from '@/lib/patient-data';
import { generateArticleContentAction } from '@/app/actions';

export default function EducationPage() {
  const [content, setContent] = useState<EducationContent[]>(mockEducationContent);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<EducationContent | null>(null);
  const [articleContent, setArticleContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);
  const { toast } = useToast();

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openArticle = async (article: EducationContent) => {
    setSelectedArticle(article);
    setReaderOpen(true);
    setIsLoading(true);
    setArticleContent('');

    try {
      const result = await generateArticleContentAction({
        title: article.title,
        category: article.category,
        summary: article.summary,
      });

      if (result.success && result.data) {
        setArticleContent(result.data.content);
        // Mark as read
        setContent(prev => prev.map(item =>
          item.id === article.id ? { ...item, isRead: true } : item
        ));
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load article content.',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load article content.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    const article = content.find(item => item.id === id);
    if (article) {
      openArticle(article);
    }
  };

  const categories = ['Treatment Info', 'Side Effects', 'Myths vs Facts', 'FAQ', 'Recovery Tips'] as const;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Treatment Info': return <BookOpen className="h-4 w-4" />;
      case 'Side Effects': return <AlertTriangle className="h-4 w-4" />;
      case 'Myths vs Facts': return <Lightbulb className="h-4 w-4" />;
      case 'FAQ': return <HelpCircle className="h-4 w-4" />;
      case 'Recovery Tips': return <Heart className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Treatment Info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Side Effects': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'Myths vs Facts': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'FAQ': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'Recovery Tips': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100';
      default: return '';
    }
  };

  // FAQ Data
  const faqItems = [
    {
      question: "Can I stop taking my medication if I feel better?",
      answer: "No, never stop your medication without consulting your doctor. Even if you feel better, the infection/condition may not be fully treated. Stopping early can lead to drug resistance and treatment failure."
    },
    {
      question: "What should I do if I miss a dose?",
      answer: "Take it as soon as you remember, unless it's almost time for your next dose. Never take a double dose. Log the missed dose in your medication tracker and note the reason, so your healthcare team can help."
    },
    {
      question: "Are the side effects normal?",
      answer: "Some side effects are common and expected. However, if you experience severe side effects or symptoms that concern you, report them immediately using the side effect reporting feature."
    },
    {
      question: "How can I manage nausea from my medications?",
      answer: "Take your medication with a light meal or snack (unless instructed otherwise). Ginger tea can help. Stay hydrated. If nausea persists, report it to your healthcare team."
    },
    {
      question: "Can I travel during my treatment?",
      answer: "Yes, with proper planning. Ensure you have enough medication, carry a copy of your prescription, and inform your healthcare team about your travel plans."
    },
    {
      question: "What if I can't afford my treatment?",
      answer: "We have financial assistance programs available. Visit the Financial Support section to apply for aid or speak with our financial counselor."
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Education & Awareness</h1>
        <p className="text-muted-foreground">Learn about your treatment and how to stay healthy</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Articles Read</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{content.filter(c => c.isRead).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{content.filter(c => !c.isRead).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="flex items-center gap-1">
              {getCategoryIcon(category)}
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredContent.map(item => (
              <Card key={item.id} className={item.isRead ? 'opacity-75' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge className={getCategoryColor(item.category)}>
                      {getCategoryIcon(item.category)}
                      <span className="ml-1">{item.category}</span>
                    </Badge>
                    {item.isRead && (
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Read
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-2">{item.title}</CardTitle>
                  <CardDescription>{item.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.readTime} read
                    </span>
                    <Button 
                      size="sm" 
                      variant={item.isRead ? 'outline' : 'default'}
                      onClick={() => markAsRead(item.id)}
                    >
                      {item.isRead ? 'Read Again' : 'Read Article'}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredContent.filter(item => item.category === category).map(item => (
                <Card key={item.id} className={item.isRead ? 'opacity-75' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge className={getCategoryColor(item.category)}>
                        {getCategoryIcon(item.category)}
                        <span className="ml-1">{item.category}</span>
                      </Badge>
                      {item.isRead && (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Read
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg mt-2">{item.title}</CardTitle>
                    <CardDescription>{item.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.readTime} read
                      </span>
                      <Button 
                        size="sm" 
                        variant={item.isRead ? 'outline' : 'default'}
                        onClick={() => markAsRead(item.id)}
                      >
                        {item.isRead ? 'Read Again' : 'Read Article'}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Important Message */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Why Education Matters</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Understanding your condition and treatment helps you make informed decisions and stay motivated. 
                Patients who are well-informed are more likely to complete their treatment successfully.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Article Reader Dialog */}
      <Dialog open={readerOpen} onOpenChange={setReaderOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                {selectedArticle && (
                  <Badge className={getCategoryColor(selectedArticle.category)}>
                    {getCategoryIcon(selectedArticle.category)}
                    <span className="ml-1">{selectedArticle.category}</span>
                  </Badge>
                )}
                <DialogTitle className="text-xl mt-2">{selectedArticle?.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3" />
                  {selectedArticle?.readTime} read
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh] pr-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Generating content with AI...</p>
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {articleContent.split('\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={idx} className="text-lg font-semibold mt-4 mb-2">{paragraph.replace('### ', '')}</h3>;
                  }
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={idx} className="text-xl font-bold mt-6 mb-3">{paragraph.replace('## ', '')}</h2>;
                  }
                  if (paragraph.startsWith('- ')) {
                    return <li key={idx} className="ml-4">{paragraph.replace('- ', '')}</li>;
                  }
                  if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                    return <p key={idx} className="text-sm italic text-muted-foreground mt-4">{paragraph.replace(/\*/g, '')}</p>;
                  }
                  if (paragraph.trim()) {
                    // Handle bold text
                    const parts = paragraph.split(/\*\*(.*?)\*\*/g);
                    return (
                      <p key={idx} className="mb-3">
                        {parts.map((part, i) => 
                          i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                        )}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </ScrollArea>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setReaderOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
            <Badge variant="outline" className="text-green-600 self-center">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Marked as Read
            </Badge>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
