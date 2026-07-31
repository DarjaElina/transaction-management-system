function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div
        className="
        mb-4
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-lg
        bg-primary/10
        text-2xl
      "
      >
        {emoji}
      </div>

      <h3 className="mb-2 text-lg font-semibold">{title}</h3>

      <p className="text-muted-foreground leading-7">{description}</p>
    </div>
  )
}

export default FeatureCard
