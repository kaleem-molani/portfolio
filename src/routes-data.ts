import { renderHome } from './pages/Home';
import { renderAbout } from './pages/About';
import { renderLearningsHub } from './pages/LearningsHub';
import { renderTopicArchive } from './pages/TopicArchive';
import { renderTopicMigrationArchive } from './pages/TopicMigrationArchive';
import { renderTopicAgenticArchive } from './pages/TopicAgenticArchive';
import { renderLabPage } from './pages/Lab';
import { renderBridgeIsTheWholeJob } from './pages/blog/integration/BridgeIsTheWholeJob';
import { renderRetriesAndIdempotency } from './pages/blog/integration/RetriesAndIdempotency';
import { renderTheHiddenCostOfBrittleWebhooks } from './pages/blog/integration/TheHiddenCostOfBrittleWebhooks';
import { renderItIsNotACopyPaste } from './pages/blog/migration/ItIsNotACopyPaste';
import { renderFromAutocompleteToAgent } from './pages/blog/agentic-ai/FromAutocompleteToAgent';

export interface RouteDefinition {
  path: string;
  title: string;
  description: string;
  image?: string;
  render: () => string;
}

export const routesList: RouteDefinition[] = [
  {
    path: '/',
    title: 'Build · Break · Learn — Kaleem Molani',
    description: 'Personal engineering publication and systems lab by Kaleem Molani. Exploring distributed systems, data migrations, integrations, and agentic AI.',
    image: 'https://kaleemmolani.com/images/portrait.jpg',
    render: renderHome,
  },
  {
    path: '/about',
    title: 'About — Kaleem Molani | Systems & Integration',
    description: "I build software systems for a living and learn to architect them out loud. Notes on systems design, integrations, and distributed architecture.",
    image: 'https://kaleemmolani.com/images/portrait.jpg',
    render: renderAbout,
  },
  {
    path: '/learnings',
    title: 'Learnings Hub — Build · Break · Learn',
    description: 'The notes I wish someone had handed me before I started — organized across Integration, Migration, and Agentic AI.',
    image: 'https://kaleemmolani.com/images/portrait.jpg',
    render: renderLearningsHub,
  },
  {
    path: '/learnings/integration',
    title: 'Integration Archive — Build · Break · Learn',
    description: "Exploring the unglamorous, critical work of connecting systems that weren't meant to talk to each other.",
    image: 'https://kaleemmolani.com/images/integration_bridge.png',
    render: renderTopicArchive,
  },
  {
    path: '/learnings/migration',
    title: 'Migration Archive — Build · Break · Learn',
    description: 'Moving data between systems that disagree on everything: lessons in schema translations, validation, and verification.',
    image: 'https://kaleemmolani.com/images/migration_translation.png',
    render: renderTopicMigrationArchive,
  },
  {
    path: '/learnings/agentic-ai',
    title: 'Agentic AI Archive — Build · Break · Learn',
    description: 'From autocomplete to autonomous agents: system architecture, tools, memory, and orchestration.',
    image: 'https://kaleemmolani.com/images/autocomplete_to_agent.png',
    render: renderTopicAgenticArchive,
  },
  {
    path: '/lab',
    title: 'Diagram Notebook Lab — Build · Break · Learn',
    description: 'Interactive in-browser Markdown architecture flowchart editor and hand-rolled SVG layout engine.',
    image: 'https://kaleemmolani.com/images/integration_bridge.png',
    render: renderLabPage,
  },
  {
    path: '/learnings/integration/bridge-is-the-whole-job',
    title: 'Integration 101: The bridge is the whole job — Kaleem Molani',
    description: 'Every integration is three parts: source, destination, and the bridge. Why the bridge is where the real thinking lives.',
    image: 'https://kaleemmolani.com/images/integration_bridge.png',
    render: renderBridgeIsTheWholeJob,
  },
  {
    path: '/learnings/integration/retries-and-idempotency',
    title: 'Retries and Idempotency: How trying again quietly doubles everything — Kaleem Molani',
    description: 'A retry that isn\'t safe to repeat is how duplicate contacts land in your target system. The mechanics of idempotency.',
    image: 'https://kaleemmolani.com/images/retries_idempotency.png',
    render: renderRetriesAndIdempotency,
  },
  {
    path: '/learnings/integration/the-hidden-cost-of-brittle-webhooks',
    title: 'The Hidden Cost of Brittle Webhooks — Kaleem Molani',
    description: 'Why integrations break when vendors improve their API, and how to build defensive ingestion layers that survive upstream changes.',
    image: 'https://kaleemmolani.com/images/webhooks.jpg',
    render: renderTheHiddenCostOfBrittleWebhooks,
  },
  {
    path: '/learnings/migration/it-is-not-a-copy-paste',
    title: 'Migration 101: It\'s not a copy-paste — Kaleem Molani',
    description: 'A data migration isn\'t moving files between boxes — it\'s rebuilding data inside a system that disagrees with the old one.',
    image: 'https://kaleemmolani.com/images/migration_translation.png',
    render: renderItIsNotACopyPaste,
  },
  {
    path: '/learnings/agentic-ai/from-autocomplete-to-agent',
    title: 'From Autocomplete to Agent: How AI actually got useful — Kaleem Molani',
    description: 'How AI went from a box predicting the next word to systems that can plan, use tools, remember, and check their work.',
    image: 'https://kaleemmolani.com/images/autocomplete_to_agent.png',
    render: renderFromAutocompleteToAgent,
  },
];
