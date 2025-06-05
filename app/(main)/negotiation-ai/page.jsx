import NegotiationSimulator from "./_components/negotiation-simulator";

export default function NegotiationPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-6xl font-bold gradient-title mb-4">
        Salary Negotiation Simulator
      </h1>
      <p className="text-muted-foreground mb-8">
        Practice your negotiation skills in a risk-free environment
      </p>

      <NegotiationSimulator />
    </div>
  );
}
