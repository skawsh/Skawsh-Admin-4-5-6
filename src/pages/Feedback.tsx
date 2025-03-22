
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MessageSquare, Send } from 'lucide-react';

const Feedback = () => {
  return (
    <Layout activeSection="feedback">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Send Feedback
              </CardTitle>
              <CardDescription>
                We value your feedback to improve our services. Please share your thoughts, suggestions, or report any issues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback-type">Feedback Type</Label>
                  <select 
                    id="feedback-type" 
                    className="w-full p-2 border border-gray-200 rounded-md"
                  >
                    <option value="suggestion">Suggestion</option>
                    <option value="issue">Report an Issue</option>
                    <option value="appreciation">Appreciation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <input 
                    id="subject"
                    type="text" 
                    className="w-full p-2 border border-gray-200 rounded-md" 
                    placeholder="Brief description of your feedback"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message"
                    placeholder="Provide detailed information here..."
                    className="min-h-[150px]"
                  />
                </div>
                
                <Button className="w-full sm:w-auto flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
                <CardDescription>
                  Changes made based on your feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">New</span>
                    <span>Improved order tracking system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">Fixed</span>
                    <span>Login issues for some users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded">Updated</span>
                    <span>Dashboard performance and analytics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Need immediate assistance?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    Our support team is available Monday-Friday, 9am-5pm.
                  </p>
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
