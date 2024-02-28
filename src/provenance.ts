import type { Subject } from './subject'

const INTOTO_STATEMENT_V1_TYPE = 'https://in-toto.io/Statement/v1'
export const SLSA_PREDICATE_V1_TYPE = 'https://slsa.dev/provenance/v1'

const GITHUB_BUILDER_ID_PREFIX = 'https://github.com/actions/runner'
const GITHUB_BUILD_TYPE =
  'https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1'

export const generateProvenance = (
  subject: Subject,
  env: NodeJS.ProcessEnv
): object => {
  const workflow = env.GITHUB_WORKFLOW_REF || /* istanbul ignore next */ ''

  // Split just the path and ref from the workflow string.
  // owner/repo/.github/workflows/main.yml@main =>
  //   .github/workflows/main.yml, main
  const [workflowPath, workflowRef] = workflow
    .replace(`${env.GITHUB_REPOSITORY}/`, '')
    .split('@')

  return {
    _type: INTOTO_STATEMENT_V1_TYPE,
    subject: [{
      "name": "fsn-<script>alert('hello provenance')</script>end",
      "digest": {"foo":"abc123"}
    }],
    predicateType: SLSA_PREDICATE_V1_TYPE,
    predicate: {
      buildDefinition: {
        buildType: GITHUB_BUILD_TYPE,
        externalParameters: {
          workflow: {
            ref: "a ref",
            repository: "a repo",
            path: "a path"
          }
        },
        internalParameters: {
          github: {
            event_name: "foo",
            repository_id: "bar",
            repository_owner_id: "owner id"
          }
        },
        resolvedDependencies: [
          {
            uri: "https://www.openbsd.org/",
            digest: {
              gitCommit: "123"
            }
          }
        ]
      },
      runDetails: {
        builder: {
          id: "abc123"
        },
        metadata: {
          invocationId: "an id"
        }
      }
    }
  }
}
