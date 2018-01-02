import cleanup from 'node-cleanup'

export default func =>
 cleanup((exitCode, signal) => {
   func()

   process.kill(process.pid, signal)
   cleanup.uninstall()
   return false
 })
