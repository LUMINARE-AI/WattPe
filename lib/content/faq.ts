export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is digital solar?",
    answer:
      "Digital solar lets you reserve capacity in a shared, off-site solar plant instead of installing panels on your own roof. The plant's generation is converted into credits and applied directly to your electricity bill.",
  },
  {
    question: "Where are WattPe's plants located?",
    answer:
      "We currently operate community solar plants serving customers in Bengaluru and Mumbai, with more cities planned as new projects come online.",
  },
  {
    question: "Do I need DISCOM approval to join?",
    answer:
      "Your electricity connection needs to be with a supported DISCOM (electricity distributor) for us to apply credits to your bill. Use the compatibility checker on the Projects page to confirm your provider is supported.",
  },
  {
    question: "How is digital solar different from rooftop solar?",
    answer:
      "Rooftop solar requires you to own a suitable roof, pay for installation, and maintain the system yourself. With WattPe, you reserve capacity in an already-operating plant and start earning credits immediately, with no hardware, installation, or maintenance on your side.",
  },
  {
    question: "Can I reserve capacity in more than one batch?",
    answer:
      "Yes — you can top up your reserved capacity over time as your usage grows, subject to availability in a given project.",
  },
  {
    question: "Are my credits transferable to someone else?",
    answer:
      "Credits are tied to the electricity account you registered when reserving capacity and are not transferable to a different account or person.",
  },
  {
    question: "Can I use my credits across multiple electricity bills?",
    answer:
      "If you have multiple connections, you can split your reserved capacity across them so each bill receives its own share of credits.",
  },
  {
    question: "What happens if I want to exit early?",
    answer:
      "Exit terms depend on your plan — some plans include a refund component at the end of the tenure, and early-exit terms are always disclosed before you reserve. See our Refund Policy for details.",
  },
];
