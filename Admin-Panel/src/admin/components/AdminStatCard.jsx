import { Card, CardBody } from "@windmill/react-ui"
import { adminCardClass } from "../utils/theme"

function AdminStatCard({ icon, label, value, delta, accent = "from-cyan-500 to-sky-500" }) {
  const Icon = icon

  return (
    <Card className={`overflow-hidden ${adminCardClass}`}>
      <CardBody className="flex items-start gap-4 p-5">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg shadow-cyan-500/20`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
            {delta ? <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">{delta}</span> : null}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default AdminStatCard