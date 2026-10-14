import type { Metadata } from 'next';
import { siteConfig, isPlaceholder } from '~/site.config';
import { companyPage } from '@/content/company';
import { contactMailto } from '@/lib/api';
import { ArrowRightIcon } from '@/components/icons';
import { InitialsAvatar } from '@/components/site';
import { ButtonLink, Chip, PageHero, Section, SectionHeading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Company',
  description:
    'Vyom is an AI-native pharmacovigilance company built in India. Our mission, our name, who is here and who we are hiring.',
};

export default function CompanyPage() {
  const { name, team, values, careers } = companyPage;

  return (
    <>
      <PageHero
        eyebrow={companyPage.eyebrow}
        heading={companyPage.heading}
        lead={companyPage.lead}
        size="lg"
      />

      {/* The name */}
      <Section alt>
        <div data-reveal className="flex flex-wrap items-start gap-x-16 gap-y-8">
          <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-4">
            <SectionHeading eyebrow={name.eyebrow} heading={name.heading} />
          </div>
          <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-5">
            <p className="m-0 text-[18px] leading-[1.6] text-pretty text-muted">{name.body}</p>
            <span className="font-mono text-[11.5px] tracking-[0.12em] text-meta">
              {name.location}
            </span>
          </div>
        </div>
      </Section>

      {/* Team */}
      <Section>
        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow={team.eyebrow} heading={team.heading} lead={team.lead} />
          <ul
            data-reveal
            className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(272px,100%),1fr))] gap-4 p-0"
          >
            {team.members.map((member) => {
              const label = team.statusLabel[member.status];
              const placeholder = isPlaceholder(member.bio);
              return (
                <li
                  key={member.name}
                  className="flex flex-col gap-4 rounded-card border border-line bg-surface p-6"
                >
                  <div className="flex items-start gap-4">
                    <InitialsAvatar name={member.name} filled={member.status === 'here'} />
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <span className="text-[17px] font-semibold text-primary">{member.name}</span>
                      <span className="text-[14.5px] leading-[1.45] text-muted">
                        {member.role}
                      </span>
                      {label ? (
                        <Chip tone="dashed" size="sm" className="mt-1 self-start">
                          {label}
                        </Chip>
                      ) : null}
                    </div>
                  </div>
                  <p
                    className={
                      placeholder
                        ? 'm-0 font-mono text-[12.5px] tracking-[0.06em] text-meta'
                        : 'm-0 text-[15px] leading-[1.6] text-muted'
                    }
                  >
                    {member.bio}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* Values */}
      <Section alt>
        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow={values.eyebrow} heading={values.heading} />
          <ul
            data-reveal
            className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-px overflow-hidden rounded-card border border-line bg-line p-0"
          >
            {values.items.map((value) => (
              <li key={value.title} className="flex flex-col gap-3 bg-alt p-7">
                <span className="text-[19px] font-semibold tracking-[-0.01em] text-primary">
                  {value.title}
                </span>
                <p className="m-0 text-[15.5px] leading-[1.6] text-muted">{value.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Careers */}
      <Section id="careers">
        <div data-reveal className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8">
          <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-4">
            <SectionHeading eyebrow={careers.eyebrow} heading={careers.heading} />
            <p className="m-0 max-w-[640px] text-[17px] leading-[1.6] text-pretty text-muted">
              {careers.body}
            </p>
          </div>
          <ButtonLink href={contactMailto('Careers at Vyom')} size="lg">
            {careers.cta}
            <ArrowRightIcon />
          </ButtonLink>
        </div>
        <p className="mt-6 font-mono text-[12.5px] tracking-[0.06em] text-meta">
          {siteConfig.email}
        </p>
      </Section>
    </>
  );
}
