interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
}

export default function SkillBar({ skill }: { skill: Skill }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{skill.name}</span>
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{skill.proficiency}%</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: 'var(--border-glass)' }}>
        <div
          className="skill-bar"
          style={{ width: `${skill.proficiency}%` }}
        />
      </div>
    </div>
  );
}
