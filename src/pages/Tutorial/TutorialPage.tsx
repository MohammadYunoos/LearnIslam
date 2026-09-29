import { useNavigate } from 'react-router-dom'
import { AppOnboarding } from '../../components/AppOnboarding'
import { appTutorialKey } from '../../lib/tutorial'
import { useAppStore } from '../../store/appStore'

export function TutorialPage() {
  const navigate = useNavigate()
  const user = useAppStore((state) => state.user)

  const complete = () => {
    if (user) localStorage.setItem(appTutorialKey(user.id), '1')
    navigate('/home', { replace: true })
  }

  return <AppOnboarding onComplete={complete} />
}
