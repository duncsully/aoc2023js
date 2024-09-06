import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import * as solutions from './days'
import { when } from 'lit/directives/when.js'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('aoc-app')
export class AoCApp extends LitElement {
  @state()
  input = ''

  @state()
  day = Object.keys(solutions)[0] as keyof typeof solutions

  @state()
  output = ''

  render() {
    return html`
      <form
        @submit=${async (e: SubmitEvent) => {
          e.preventDefault()
          this.output = 'Running...'

          const func = solutions[this.day] as (input: string) => {
            toString(): string
          }

          const start = performance.now()
          const output = func(this.input)
          console.log(`${this.day} took ${performance.now() - start}ms`)
          this.output = output.toString()
        }}
      >
        <label
          >Puzzle:
          <select
            .value=${this.day}
            @change=${(e: InputEvent) =>
              (this.day = (e.currentTarget as HTMLSelectElement)
                .value as keyof typeof solutions)}
          >
            ${Object.keys(solutions).map(
              (key) => html`<option value=${key}>${key}</option>`
            )}
          </select>
        </label>
        <label>
          Input:
          <textarea
            .value=${this.input}
            @input=${(e: InputEvent) =>
              (this.input = (e.currentTarget as HTMLTextAreaElement).value)}
          ></textarea>
        </label>
        <button type="submit">Run</button>
      </form>
      ${when(
        this.output,
        () =>
          html`<p @click=${() => navigator.clipboard.writeText(this.output)}>
            Result (click to copy):
            <code>${this.output}</code>
          </p>`
      )}
    `
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1em;
    }

    .card {
      padding: 2em;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 0.5em;
      align-items: flex-start;
    }

    select {
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-family: inherit;
      border-radius: 8px;
    }

    textarea {
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-family: inherit;
      border-radius: 8px;
      min-height: 10em;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    p {
      text-align: left;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'aoc-app': AoCApp
  }
}
