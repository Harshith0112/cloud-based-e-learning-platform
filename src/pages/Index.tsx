import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Calendar, Users } from "lucide-react";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="hero-gradient py-16 px-4 md:py-24 text-white">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Unlock Your Potential with EduVerse
              </h1>
              <p className="text-lg mb-6">
                The comprehensive e-learning platform designed for students, teachers, and administrators.
                Access courses, track progress, and achieve your educational goals.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg" className="bg-white text-brand-blue hover:bg-brand-light">
                  <Link to="/signup">Sign Up as Student</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white text-brand-blue hover:bg-brand-light">
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWR1Y2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" 
                alt="Education" 
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-brand-light">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-brand-blue">
            One Platform, Three Portals
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="rounded-full bg-brand-blue/10 w-16 h-16 flex items-center justify-center mb-4">
                  <Users className="text-brand-blue w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-brand-blue">Student Portal</h3>
                <p className="text-gray-600">
                  Access your courses, track your progress, submit assignments, and engage with peers and instructors.
                </p>
                <Button asChild variant="link" className="mt-4 text-brand-blue p-0">
                  <Link to="/signup">Sign Up Now</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="rounded-full bg-brand-green/10 w-16 h-16 flex items-center justify-center mb-4">
                  <Book className="text-brand-green w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-brand-green">Teacher Portal</h3>
                <p className="text-gray-600">
                  Create and manage courses, track student progress, grade assignments, and provide feedback.
                </p>
                <Button asChild variant="link" className="mt-4 text-brand-green p-0">
                  <Link to="/login">Login Required</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="rounded-full bg-brand-accent/10 w-16 h-16 flex items-center justify-center mb-4">
                  <Calendar className="text-brand-accent w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-brand-accent">Admin Portal</h3>
                <p className="text-gray-600">
                  Manage users, oversee courses, monitor platform usage, and ensure everything runs smoothly.
                </p>
                <Button asChild variant="link" className="mt-4 text-brand-accent p-0">
                  <Link to="/login">Login Required</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-brand-blue">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join EduVerse today and gain access to a comprehensive learning management system designed to help you succeed.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-brand-blue hover:bg-brand-blue/90">
              <Link to="/signup">Sign Up as Student</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-100">
        <div className="container mx-auto">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 EduVerse Learning Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
