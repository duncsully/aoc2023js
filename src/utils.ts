/**
 * Wrap a function into a worker
 * @param func
 */
export function functionAsWorker<T extends Function>(func: T) {
  addEventListener('message', (e) => {
    if (!e?.data) return
    const output = func(e.data)
    self.postMessage(output)
  })
}

/**
 * Create a worker with the given URL, sending the input, returning the output
 * as a promise, and terminating the worker
 */
export function workerAsPromise(workerUrl: string | URL, input: string) {
  const worker = new Worker(workerUrl, { type: 'module' })
  return new Promise<unknown>((resolve) => {
    worker.onmessage = ({ data }) => {
      resolve(data)
      worker.terminate()
    }
    worker.postMessage(input)
  })
}
