'use client';

import type { FormEvent, KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  BriefcaseBusiness,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Lightbulb,
  Mail,
  MessageCircleQuestion,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Square,
  Trash2,
} from 'lucide-react';
import { trackAssistantQuestion, trackEvent } from '../../lib/analytics';
import type {
  AssistantCategory,
  AssistantHistoryItem,
  AssistantSource,
} from '../../lib/portfolioAssistant';
import styles from './portfolioAssistant.module.css';

type Message = {
  id: number;
  role: 'assistant' | 'user';
  text: string;
  sources?: AssistantSource[];
  status?: string;
  stopped?: boolean;
};

type StreamEvent =
  | { type: 'meta'; category: AssistantCategory; sources: AssistantSource[]; status: string }
  | { type: 'delta'; text: string }
  | { type: 'done'; fallback: boolean }
  | { type: 'error'; message: string; code: string };

type AskSource = 'suggestion' | 'typed' | 'command';

const suggestions = [
  { label: 'Backend engineering', detail: 'APIs, systems, and data', question: '/projects backend', icon: BriefcaseBusiness },
  { label: 'MANTA thesis', detail: 'Research in plain English', question: '/explain manta', icon: Lightbulb },
  { label: 'EV charging', detail: 'OCPP and tariff systems', question: 'What has Mahmoud built for EV charging?', icon: Sparkles },
  { label: 'Security work', detail: 'Networks, privacy, and tooling', question: '/projects security', icon: ShieldCheck },
];

const welcome: Message = {
  id: 1,
  role: 'assistant',
  text: 'I turn Mahmoud’s portfolio into quick, evidence-backed answers. Ask what he has built, how a project works, or why his experience fits your role.',
  status: 'Portfolio ready',
};

function statusLabel(status?: string) {
  if (status === 'Grounded with Workers AI') return 'AI answer';
  if (status === 'Portfolio command') return 'Portfolio lookup';
  if (status === 'Protected by Elly guardrails') return 'Safe response';
  if (status === 'Portfolio fallback') return 'Portfolio match';
  return status ?? 'Verified answer';
}

function recentHistory(messages: Message[]): AssistantHistoryItem[] {
  return messages
    .filter((message) => message.id !== welcome.id && message.text && !message.stopped)
    .slice(-4)
    .map((message) => ({ role: message.role, content: message.text }));
}

export function PortfolioAssistant() {
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [question, setQuestion] = useState('');
  const [pending, setPending] = useState(false);
  const [activity, setActivity] = useState('Ready');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [lastQuestion, setLastQuestion] = useState<{ text: string; source: AskSource } | null>(null);
  const nextId = useRef(2);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (messages.length > 1 || pending) {
      endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [messages, pending]);

  useEffect(() => () => abortRef.current?.abort(), []);

  function updateAssistantMessage(id: number, update: Partial<Message>) {
    setMessages((current) => current.map((message) => (
      message.id === id ? { ...message, ...update } : message
    )));
  }

  async function ask(rawQuestion: string, source: AskSource = 'typed') {
    const value = rawQuestion.trim();
    if (!value || pending) return;

    const history = recentHistory(messages);
    const userId = nextId.current++;
    const assistantId = nextId.current++;
    const controller = new AbortController();
    abortRef.current = controller;
    setQuestion('');
    setPending(true);
    setActivity('Elly is thinking');
    setLastQuestion({ text: value, source });
    setMessages((current) => [
      ...current,
      { id: userId, role: 'user', text: value },
      { id: assistantId, role: 'assistant', text: '', status: 'Thinking' },
    ]);

    let category: AssistantCategory = 'general';
    let fallback = false;
    let receivedText = '';
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: value, history }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(payload.error ?? 'Elly is temporarily unavailable.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { value: chunk, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as StreamEvent;
          if (event.type === 'meta') {
            category = event.category;
            setActivity(event.status);
            updateAssistantMessage(assistantId, { sources: event.sources, status: event.status });
          } else if (event.type === 'delta') {
            receivedText += event.text;
            updateAssistantMessage(assistantId, { text: receivedText });
          } else if (event.type === 'done') {
            fallback = event.fallback;
          } else if (event.type === 'error') {
            throw new Error(event.message);
          }
        }
      }
      if (!receivedText) throw new Error('Elly returned an empty response.');
      trackAssistantQuestion(category, value.startsWith('/') ? 'command' : source, fallback);
      setActivity(fallback ? 'Portfolio fallback' : 'Ready');
    } catch (error) {
      if (controller.signal.aborted) {
        updateAssistantMessage(assistantId, {
          text: receivedText || 'Response stopped.',
          status: 'Stopped',
          stopped: true,
        });
        setActivity('Stopped');
        trackAssistantQuestion(category, value.startsWith('/') ? 'command' : source, fallback, 'stopped');
      } else {
        updateAssistantMessage(assistantId, {
          text: error instanceof Error ? error.message : 'Elly is temporarily unavailable.',
          status: 'Could not answer',
        });
        setActivity('Needs retry');
        trackAssistantQuestion(category, value.startsWith('/') ? 'command' : source, fallback, 'failed');
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setPending(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  function clearConversation() {
    trackEvent('Elly Conversation Cleared');
    abortRef.current?.abort();
    setMessages([welcome]);
    setQuestion('');
    setLastQuestion(null);
    setActivity('Ready');
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  async function copyAnswer(message: Message) {
    trackEvent('Elly Answer Copied');
    await navigator.clipboard.writeText(message.text);
    setCopiedId(message.id);
    window.setTimeout(() => setCopiedId((current) => current === message.id ? null : current), 1_600);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void ask(question);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (question.trim()) void ask(question);
    }
    if (event.key === 'Escape' && pending) stop();
  }

  const lastMessage = messages[messages.length - 1];
  const canRetry = !pending && lastQuestion && lastMessage.role === 'assistant'
    && (lastMessage.status === 'Could not answer' || lastMessage.stopped);

  return (
    <div className={styles.assistant} data-state={messages.length === 1 ? 'landing' : 'conversation'}>
      <div className={styles.intro}>
        <span className={`${styles.mascot} ${pending ? styles.mascotThinking : ''}`}>
          <img src="/Logo-transparent.png" alt="" />
          <i aria-hidden="true" />
        </span>
        <span className={styles.identity}>
          <strong>Portfolio intelligence</strong>
          <small>{activity}</small>
        </span>
        <span className={styles.headerActions}>
          {messages.length > 1 ? (
            <button type="button" onClick={clearConversation} aria-label="Clear conversation" title="Clear conversation">
              <Trash2 size={15} />
            </button>
          ) : null}
          <span className={styles.status}><i /> Online</span>
        </span>
      </div>

      <div className={styles.messages} aria-live="polite" aria-busy={pending}>
        {messages.map((message) => (
          <article key={message.id} className={`${styles.message} ${styles[message.role]}`}>
            {message.role === 'assistant' && message.id !== welcome.id ? (
              <img src="/Logo-transparent.png" alt="" className={styles.avatar} />
            ) : null}
            <div className={`${styles.bubble} ${message.id === welcome.id ? styles.welcomeBubble : ''}`}>
              {message.id === welcome.id ? (
                <div className={styles.welcomeHeading}>
                  <span><Sparkles size={13} /> Portfolio copilot</span>
                  <strong>Find the signal, skip the scrolling.</strong>
                </div>
              ) : null}
              {message.role === 'assistant' && message.id !== welcome.id && message.text ? (
                <div className={styles.answerHeading}>
                  <span><MessageCircleQuestion size={13} /> Elly’s answer</span>
                  <i>{statusLabel(message.status)}</i>
                </div>
              ) : null}
              {message.text ? message.text.split('\n').map((line, index) => (
                <p key={`${message.id}-${index}`}>{line || '\u00a0'}</p>
              )) : (
                <span className={styles.thinking} aria-label="Elly is thinking">
                  <span><i /><i /><i /></span>
                  <small>Reading the portfolio</small>
                </span>
              )}
              {message.sources?.length ? (
                <div className={styles.sources} aria-label="Verified portfolio sources">
                  <div className={styles.sourcesHeading}>
                    <span><ShieldCheck size={13} /> Evidence from the portfolio</span>
                    <small>{message.sources.length} {message.sources.length === 1 ? 'source' : 'sources'}</small>
                  </div>
                  {message.sources.map((source, index) => (
                    <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
                      <i className={styles.sourceIndex}>{String(index + 1).padStart(2, '0')}</i>
                      <span>
                        <small>{source.kind}</small>
                        <strong>{source.title}</strong>
                      </span>
                      <span className={styles.sourceTags}>
                        {source.tags.map((tag) => <i key={tag}>{tag}</i>)}
                      </span>
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              ) : null}
              {message.role === 'assistant' && message.text && message.id !== welcome.id ? (
                <div className={styles.messageMeta}>
                  <span><ShieldCheck size={11} /> Grounded in published work</span>
                  <button type="button" onClick={() => void copyAnswer(message)} aria-label="Copy answer">
                    {copiedId === message.id ? <Check size={13} /> : <Copy size={13} />}
                    {copiedId === message.id ? 'Copied' : 'Copy'}
                  </button>
                </div>
              ) : null}
            </div>
          </article>
        ))}
        <div ref={endRef} />
      </div>

      {messages.length === 1 ? (
        <div className={styles.suggestions} aria-label="Suggested questions">
          {suggestions.map((suggestion) => (
            <button
              type="button"
              key={suggestion.label}
              onClick={() => void ask(suggestion.question, 'suggestion')}
            >
              <span className={styles.suggestionIcon}><suggestion.icon size={15} /></span>
              <span>
                <strong>{suggestion.label}</strong>
                <small>{suggestion.detail}</small>
              </span>
              <ArrowUp size={13} className={styles.suggestionArrow} />
            </button>
          ))}
        </div>
      ) : null}

      {canRetry ? (
        <div className={styles.recovery}>
          <span>That answer did not finish.</span>
          <button type="button" onClick={() => void ask(lastQuestion.text, lastQuestion.source)}>
            <RotateCcw size={13} /> Retry
          </button>
          <button type="button" onClick={() => void ask(`/projects ${lastQuestion.text}`, 'command')}>
            Show project matches
          </button>
        </div>
      ) : null}

      <form className={styles.form} onSubmit={submit}>
        <div className={styles.composer}>
          <label htmlFor="elly-question">Ask a focused question</label>
          <textarea
            id="elly-question"
            ref={inputRef}
            value={question}
            onChange={(event) => {
              setQuestion(event.target.value.slice(0, 500));
              event.currentTarget.style.height = 'auto';
              event.currentTarget.style.height = `${Math.min(event.currentTarget.scrollHeight, 76)}px`;
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Try: Which project best shows backend experience?"
            aria-label="Question for Elly, Mahmoud's portfolio assistant"
            rows={1}
            disabled={pending}
          />
        </div>
        <span className={`${styles.counter} ${question.length > 450 ? styles.counterWarn : ''}`}>
          {question.length ? `${question.length}/500` : '↵ send'}
        </span>
        {pending ? (
          <button type="button" className={styles.stopButton} onClick={stop} aria-label="Stop response">
            <Square size={13} />
          </button>
        ) : (
          <button type="submit" disabled={!question.trim()} aria-label="Send question">
            <ArrowUp size={17} />
          </button>
        )}
      </form>
      <div className={styles.footer}>
        <span>Grounded in Mahmoud’s public portfolio. Verified links are the source of truth.</span>
        <span className={styles.footerLinks}>
          <a href="/Mahmoud_Elfil_CV.pdf"><FileText size={13} /> CV</a>
          <a href="mailto:mahmoudelfeelig@gmail.com"><Mail size={13} /> Contact</a>
        </span>
      </div>
    </div>
  );
}
