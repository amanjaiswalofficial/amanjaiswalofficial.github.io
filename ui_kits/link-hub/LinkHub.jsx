import React from 'react';
import { SwipeDeck } from '../../components/layout/SwipeDeck';
import { Panel } from '../../components/layout/Panel';
import { ParticleMorph } from '../../components/three/ParticleMorph';
import { DisplayHeading } from '../../components/type/DisplayHeading';
import { Eyebrow } from '../../components/type/Eyebrow';
import { Statement } from '../../components/type/Statement';
import { RuledList } from '../../components/lists/RuledList';
import { IndexLinkRow } from '../../components/lists/IndexLinkRow';
import { DatedRow } from '../../components/lists/DatedRow';
import { RepoRow } from '../../components/lists/RepoRow';
import { RoleRow } from '../../components/lists/RoleRow';
import { CtaBar } from '../../components/actions/CtaBar';
import { TextButton } from '../../components/actions/TextButton';

export const HUB = {
  name: 'Aman Jaiswal',
  bio: 'Senior Software Engineer at Harness. Part-time nerd. Writes about tech, cinema and everything in between.',
  roles: [
    { when: 'Now', title: 'Senior Software Engineer II', org: 'Harness', logo: 'https://www.google.com/s2/favicons?domain=harness.io&sz=64' },
    { when: 'Before', title: 'Software Engineer, Core Data & ML', org: 'CRED', logo: 'https://www.google.com/s2/favicons?domain=cred.club&sz=64' },
    { when: 'Before', title: 'Software Engineer III', org: 'Walmart', logo: 'https://www.google.com/s2/favicons?domain=walmart.com&sz=64' },
  ],
  links: {
    medium: 'https://amanjaiswalofficial.medium.com/',
    github: 'https://github.com/amanjaiswalofficial',
    linkedin: 'https://www.linkedin.com/in/amanjaiswalofficial/',
    x: 'https://x.com/awesomeamanj',
  },
  articles: [
    { date: 'Jul 2026', title: 'Your AI Isn’t Private. Here’s How I Took Back Control', href: 'https://amanjaiswalofficial.medium.com/your-ai-isnt-private-here-s-how-i-took-back-control-eb73e3b1cd3a' },
    { date: 'May 2026', title: 'Don’t buy GPUs for AI (Your RTX 3090 can do everything)', href: 'https://amanjaiswalofficial.medium.com/dont-buy-gpus-for-ai-your-rtx-3090-can-do-everything-0626f375d227' },
    { date: 'Jan 2026', title: '2025: A retrospective', href: 'https://amanjaiswalofficial.medium.com/2025-a-retrospective-8525a0b30ac7' },
    { date: 'Dec 2025', title: 'A No-BS “How to Become an ML Engineer” Guide', href: 'https://amanjaiswalofficial.medium.com/a-no-bs-how-to-become-an-ml-engineer-guide-2025-3b7ff722da35' },
  ],
  repos: [
    { name: 'ml-engineer-roadmap', lang: 'Jupyter', description: 'Projects and notebooks from learning ML and MLE concepts.', href: 'https://github.com/amanjaiswalofficial/machine-learning-engineer-roadmap' },
    { name: 'ano', lang: 'Go', description: 'Every little thing we miss from the internet, piled in one place.', href: 'https://github.com/amanjaiswalofficial/ano' },
    { name: 'youter', lang: 'JavaScript', description: 'Your own Twitter. Flask, React and Redis.', href: 'https://github.com/amanjaiswalofficial/youter' },
    { name: 'Natalie', lang: 'Python', description: 'Web scrapers that deliver updates through a Slack bot.', href: 'https://github.com/amanjaiswalofficial/Natalie' },
  ],
};

const PAGES = [
  { label: 'Index',   bg: 'var(--paper)',  ink: 'var(--ink)',          dot: '#EA3F2B' },
  { label: 'Writing', bg: 'var(--signal)', ink: 'var(--ink)',          dot: '#111111' },
  { label: 'Code',    bg: 'var(--carbon)', ink: 'var(--ink-inverse)',  dot: '#EA3F2B' },
  { label: 'Work',    bg: 'var(--cobalt)', ink: 'var(--ink-on-cobalt)', dot: '#F4F2EC' },
  { label: 'Contact', bg: 'var(--citron)', ink: 'var(--ink)',          dot: '#111111' },
];

export function LinkHub({ content = HUB, showGrid = true }) {
  const pm = React.useRef(), deck = React.useRef(), L = content.links;
  return (
    <SwipeDeck name={content.name} pages={PAGES} showGrid={showGrid} apiRef={deck}
      backdrop={<ParticleMorph ref={pm} colors={PAGES.map(p => p.dot)} />}
      onProgress={p => pm.current && pm.current.setProgress(p)}>

      <Panel color="var(--ink)" gap="var(--space-7)" label="01 Index">
        <DisplayHeading preset="index" lines={content.name.split(' ')} />
        <Statement size="body">{content.bio}</Statement>
        <RuledList style={{ marginTop: 6 }}>
          <IndexLinkRow number="01" title="Medium" meta="Writing" href={L.medium} />
          <IndexLinkRow number="02" title="GitHub" meta="Code" href={L.github} />
          <IndexLinkRow number="03" title="LinkedIn" meta="Work" href={L.linkedin} />
          <IndexLinkRow number="04" title="X" meta="@awesomeamanj" href={L.x} />
        </RuledList>
      </Panel>

      <Panel color="var(--ink)" label="02 Writing">
        <Eyebrow left="02 — Writing" right="on Medium" />
        <DisplayHeading preset="writing" lines="Writing" />
        <RuledList>{content.articles.map(a => <DatedRow key={a.href} {...a} />)}</RuledList>
        <CtaBar label="All writing on Medium" href={L.medium} bg="var(--ink)" fg="var(--paper)" />
      </Panel>

      <Panel color="var(--ink-inverse)" label="03 Code">
        <Eyebrow left="03 — Code" right="on GitHub" />
        <DisplayHeading preset="code" lines="Code" />
        <RuledList rule="var(--rule-on-carbon)">{content.repos.map(r => <RepoRow key={r.href} {...r} />)}</RuledList>
        <CtaBar label="github.com/amanjaiswalofficial" href={L.github} bg="var(--paper)" fg="var(--carbon)" mono />
      </Panel>

      <Panel color="var(--ink-on-cobalt)" gap="var(--space-8)" label="04 Work">
        <Eyebrow left="04 — Work" right="on LinkedIn" />
        <DisplayHeading preset="work" lines="Work" />
        <Statement>Currently at Harness.</Statement>
        <RuledList>{content.roles.map(r => <RoleRow key={r.title + r.org} {...r} />)}</RuledList>
        <Statement size="meta">Uttar Pradesh, India</Statement>
        <CtaBar label="Experience on LinkedIn" href={L.linkedin} bg="var(--ink-on-cobalt)" fg="var(--cobalt)" style={{ marginTop: 8 }} />
      </Panel>

      <Panel color="var(--ink)" label="05 Contact">
        <Eyebrow left="05 — Contact" right="Say hello" />
        <DisplayHeading preset="contact" lines={['Say', 'hi.']} />
        <RuledList style={{ marginTop: 6 }}>
          <IndexLinkRow title="X" meta="@awesomeamanj" href={L.x} />
          <IndexLinkRow title="LinkedIn" meta="Send a message" href={L.linkedin} />
        </RuledList>
        <TextButton onClick={() => deck.current && deck.current.go(0)}>↺ Back to start</TextButton>
      </Panel>
    </SwipeDeck>
  );
}
