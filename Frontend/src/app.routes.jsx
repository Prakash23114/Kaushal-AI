import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import Login from './Features/auth/pages/Login';
import Register from './Features/auth/pages/Register';
import Protected from './Features/auth/components/Protected';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import DashboardHome from './pages/DashboardHome';
import NewInterview from './pages/NewInterview';
import Interview from './Features/interview/pages/interview';
import AiCoach from './pages/AiCoach';
import MockInterview from './pages/MockInterview';
import ProjectInterview from './pages/ProjectInterview';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import JobAnalyzer from './pages/JobAnalyzer';
import QuestionBank from './pages/QuestionBank';
import PreparationRoadmap from './pages/PreparationRoadmap';
import MyInterviews from './pages/MyInterviews';
import ProgressAnalytics from './pages/ProgressAnalytics';
import DailyChallenge from './pages/DailyChallenge';

export const router = createBrowserRouter([
  // Public Marketing Landing Page
  {
    path: '/',
    element: <LandingPage />,
  },

  // Public Authentication
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },

  // Backward compatibility alias for direct report links
  {
    path: '/interview/:interviewId',
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [
      {
        index: true,
        element: <Interview />,
      },
    ],
  },

  // Main Protected SaaS Application Shell
  {
    path: '/app',
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardHome />,
      },
      {
        path: 'new-interview',
        element: <NewInterview />,
      },
      {
        path: 'interview/:interviewId',
        element: <Interview />,
      },
      {
        path: 'coach',
        element: <AiCoach />,
      },
      {
        path: 'mock-interview',
        element: <MockInterview />,
      },
      {
        path: 'project-interview',
        element: <ProjectInterview />,
      },
      {
        path: 'resume-analyzer',
        element: <ResumeAnalyzer />,
      },
      {
        path: 'job-analyzer',
        element: <JobAnalyzer />,
      },
      {
        path: 'question-bank',
        element: <QuestionBank />,
      },
      {
        path: 'roadmap',
        element: <PreparationRoadmap />,
      },
      {
        path: 'my-interviews',
        element: <MyInterviews />,
      },
      {
        path: 'progress',
        element: <ProgressAnalytics />,
      },
      {
        path: 'daily-challenge',
        element: <DailyChallenge />,
      },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);