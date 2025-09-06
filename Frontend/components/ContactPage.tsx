import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Send,
  HelpCircle,
  BookOpen,
  Video,
  Users,
  Headphones,
  CheckCircle
} from 'lucide-react';
import { contactService } from '../lib/services';
import { toast } from 'sonner';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

const supportOptions = [
  {
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    icon: MessageCircle,
    availability: 'Available 24/7',
    color: 'bg-green-100 text-green-700',
    action: 'Start Chat'
  },
  {
    title: 'Video Call',
    description: 'Schedule a one-on-one design consultation',
    icon: Video,
    availability: 'Mon-Fri, 9AM-6PM EST',
    color: 'bg-blue-100 text-blue-700',
    action: 'Schedule Call'
  },
  {
    title: 'Email Support',
    description: 'Send us detailed questions or feedback',
    icon: Mail,
    availability: 'Response within 24h',
    color: 'bg-purple-100 text-purple-700',
    action: 'Send Email'
  },
  {
    title: 'Community Forum',
    description: 'Connect with other designers and users',
    icon: Users,
    availability: 'Active community',
    color: 'bg-orange-100 text-orange-700',
    action: 'Join Forum'
  }
];

const faqItems = [
  {
    question: 'How do I download purchased templates?',
    answer: 'After purchasing, templates are available in your Dashboard under "My Downloads". You can access them anytime and download in multiple formats.'
  },
  {
    question: 'Can I customize the design templates?',
    answer: 'Yes! All our templates come with customization tools. You can modify colors, furniture, layouts, and more using our built-in design editor.'
  },
  {
    question: 'Are the templates suitable for commercial use?',
    answer: 'Most templates include commercial licenses. Check the specific license details on each template page for commercial usage rights.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee for all paid templates. If you\'re not satisfied, contact our support team for a full refund.'
  },
  {
    question: 'How do I get design consultation?',
    answer: 'Premium users can schedule one-on-one video consultations with our interior designers. Book through the "Video Call" support option above.'
  }
];

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await contactService.create({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      if (success) {
        toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
        setFormData({ name: '', email: '', subject: '', message: '', category: 'general' });
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-background to-accent/20 px-6 py-12 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Need help with your design project? Our team of experts is here to assist you 
            with templates, customization, and design advice.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Support Options */}
          <div className="mb-12">
            <h2 className="text-2xl mb-6 text-center">How can we help you?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card 
                    key={option.title} 
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 text-center"
                    onClick={() => {
                      if (option.title === 'Live Chat') {
                        setIsChatOpen(true);
                      }
                    }}
                  >
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 rounded-full ${option.color} flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-medium mb-2">{option.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                      <Badge variant="outline" className="text-xs mb-4">
                        {option.availability}
                      </Badge>
                      <Button size="sm" className="w-full">
                        {option.action}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Send us a message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm mb-2">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm mb-2">
                        Category
                      </label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Support</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="design">Design Consultation</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm mb-2">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Please provide as much detail as possible..."
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* FAQ and Contact Info */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">support@designhub.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-sm text-muted-foreground">Mon-Fri: 9AM-6PM EST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">New York, NY, USA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {faqItems.map((faq, index) => (
                      <details key={index} className="group">
                        <summary className="flex items-center justify-between cursor-pointer p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors">
                          <span className="font-medium">{faq.question}</span>
                          <HelpCircle className="w-4 h-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="p-3 text-sm text-muted-foreground">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button variant="outline">
                      <BookOpen className="w-4 h-4 mr-2" />
                      View All FAQs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      {isChatOpen && (
        <div className="fixed bottom-24 md:bottom-6 right-6 w-80 h-96 bg-background border border-border rounded-lg shadow-lg flex flex-col z-50">
          <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="font-medium">Support Chat</span>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="bg-accent/30 rounded-lg p-3 text-sm">
                <p className="font-medium mb-1">Support Agent</p>
                <p>Hi! How can I help you today? I'm here to answer any questions about our design templates and platform.</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  Template Help
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  Billing Question
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  Design Consultation
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input placeholder="Type your message..." className="flex-1" />
              <Button size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <Button
          className="fixed bottom-24 md:bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-40"
          onClick={() => setIsChatOpen(true)}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}