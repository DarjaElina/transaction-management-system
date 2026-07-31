import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import FeatureCard from './FeatureCard'
import { highlights, technologies } from '@/constants'

function Landing() {
  return (
    <div className="space-y-24 py-12">
      <section className="space-y-8 text-center">
        <div className="inline-flex rounded-full border bg-muted px-4 py-2 text-sm text-muted-foreground">
          Full Stack Portfolio Project
        </div>

        <div className="space-y-5">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Transaction
            <span className="text-primary"> Management System</span>
          </h1>

          <p className="mx-auto max-w-3xl text-lg text-muted-foreground leading-8">
            A full-stack application built to explore modern backend and
            frontend development using FastAPI, React, TypeScript and
            PostgreSQL.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/signup" className={buttonVariants({ size: 'lg' })}>
            Try Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

          <Link
            to="/login"
            className={buttonVariants({
              variant: 'outline',
              size: 'lg',
            })}
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Technology Stack</h2>

          <p className="mt-2 text-muted-foreground">
            Built with technologies commonly used in modern production
            applications.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border bg-card px-4 py-2 text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <FeatureCard
          emoji="🏗️"
          title="Full-Stack Architecture"
          description="Separated frontend and backend layers with API services, dependency injection, reusable components and clean project structure."
        />

        <FeatureCard
          emoji="🔐"
          title="Authentication Flow"
          description="JWT authentication with HTTP-only cookies, refresh tokens, Redis sessions and protected routes."
        />

        <FeatureCard
          emoji="🗄️"
          title="Database & Migrations"
          description="PostgreSQL database design with SQLModel, Alembic migrations and relational models."
        />

        <FeatureCard
          emoji="🧪"
          title="Testing & Developer Experience"
          description="Backend API tests, React Query integration, TypeScript validation and reusable frontend architecture."
        />
      </section>

      <section className="rounded-2xl border bg-card p-8">
        <h2 className="text-2xl font-semibold">Project Highlights</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {highlights.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Landing
