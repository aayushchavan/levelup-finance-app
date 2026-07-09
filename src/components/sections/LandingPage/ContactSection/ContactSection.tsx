import { BatchInfo } from "./BatchInfo";
import { ContactForm } from "./ContactForm";

interface ContactSectionProps {
  batchStartDate?: string;
  targetExams?: string;
  fees?: string;
  classSchedule?: string;
  classMode?: string;
}

export function ContactSection({
  batchStartDate,
  targetExams,
  fees,
  classSchedule,
  classMode,
}: ContactSectionProps) {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ready to <span className="text-primary">Level Up?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join LevelUp Finance Institute and kickstart your CFA journey with mentors who truly care
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
          <BatchInfo
            batchStartDate={batchStartDate}
            targetExams={targetExams}
            fees={fees}
            classSchedule={classSchedule}
            classMode={classMode}
          />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
