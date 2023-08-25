#!groovy
import groovy.json.JsonOutput

def stageTerraformOutput = [:]

def MASTER_BRANCH = "master"
def CAAS_SANDBOX_BRANCH = "getting-started-with-caas"

pipeline {
  // agrent used for the pipeline
  agent {
    node {
      label 'docker && linux'
    }
  }

  // enviorment vars
  environment {
    SLACK_CHANNEL = '#prdfam-dlt-ci'
    AWS_ROLE = 'Jenkins'
    AWS_REGION = 'us-west-2'

    ASU_UTO_BCDL_SANDBOX = '637157772794'

    CAAS_PROD_AWS_ACCOUNT_ID = '973536734043'
    CAAS_PROD_VAULT_ADDR = 'https://vault.caas-prod.asu.edu'
    CAAS_PROD_VAULT_CRED = 'caas-prod-vault-jenkins'

    CAAS_SANDBOX_AWS_ACCOUNT_ID = '241368890525'
    CAAS_SANDBOX_VAULT_ADDR = 'https://vault.caas-sandbox.asu.edu'
    CAAS_SANDBOX_VAULT_CRED = 'caas-sandbox-vault-jenkins'

    TWISTLOCK_CONSOLE_URI = 'https://twistlock.caas-prod.asu.edu:443'

    TERRAFORM_VERSION = '1.0'
    STATE_REPLACE_PROVIDER = false
  }

  // meta options for pipeline
  options {
    timeout(time: 60, unit: 'MINUTES')
    disableConcurrentBuilds()
  }

  stages {
    stage('prep') {
      agent {
        label 'docker && linux'
      }
      steps {
        script {
          jenkins_caas_vault_token = getVaultAppRoleTokenForCredential(CAAS_PROD_VAULT_ADDR, CAAS_PROD_VAULT_CRED)
          // uses prod sonarqube and twistlock for all branches
          twistlock_secret = getVaultV1Secret(CAAS_PROD_VAULT_ADDR, "services/dco/jenkins/cmpl/twistlock/prod/api/principals/jenkins/userpassword", jenkins_caas_vault_token)

          // CaaS Platform Edge-Case: For use with deploying to caas-sandbox
          // Apply terraform configs specific to sandbox
          if(env.BRANCH_NAME == CAAS_SANDBOX_BRANCH) {
            echo 'On sandbox branch... applying configs to reference to caas-sandbox and caas-sandbox vault.'
            aws_account_id = CAAS_SANDBOX_AWS_ACCOUNT_ID
            caas_vault_addr = CAAS_SANDBOX_VAULT_ADDR

            // hardcode vault app role "apps-reverse-transfer-sandbox-dev"
            jenkins_caas_vault_token = getVaultAppRoleTokenForCredential(CAAS_SANDBOX_VAULT_ADDR, CAAS_SANDBOX_VAULT_CRED)
          } else {
            echo 'Applying configs to reference to caas-prod and caas-prod vault.'
            aws_account_id = CAAS_PROD_AWS_ACCOUNT_ID
            caas_vault_addr = CAAS_PROD_VAULT_ADDR
          }

          IMAGE_REGISTRY = "${aws_account_id}.dkr.ecr.${AWS_REGION}.amazonaws.com/dlt-reverse-transfer/server"
          IMAGE_TAG = "ci-${GIT_COMMIT.take(6)}"
        }
      }
    } // prep

    // this stage applies the terraform for sandbox and prod
    // it looks like these files setup the EKS cluster and name things in 
    // there respective enviorments
    stage('terraform global') {
      stages {
        stage('terraform global-sandbox') {
          steps {
            script {
              terraform(
                subdir: 'terraform/global',
                workspace: 'sandbox',
                apply_on_branch: CAAS_SANDBOX_BRANCH,
                slack_channel: SLACK_CHANNEL,
                terraform_version_tag: TERRAFORM_VERSION,
                state_replace_provider: STATE_REPLACE_PROVIDER)
            }
          }
        }
      }
    } // END - terraform global
    
    stage('terraform sandbox-dev resources') {
      steps {
        script {
          terraform(
            subdir: 'terraform/resources',
            workspace: 'sandbox-dev',
            apply_on_branch: CAAS_SANDBOX_BRANCH,
            extra_args: "-var caas_vault_addr=${caas_vault_addr} \
              -var caas_vault_token=${jenkins_caas_vault_token}",
            slack_channel: SLACK_CHANNEL,
            terraform_version_tag: TERRAFORM_VERSION,
            state_replace_provider: STATE_REPLACE_PROVIDER)
        }
      }
    } // END - terraform-sandbox resources
    stage('terraform sandbox-dev resources output') {
      agent {
        docker {
          image 'asuuto/dco-terragrunt:${TERRAFORM_VERSION}'
          registryUrl ''
          registryCredentialsId 'docker-hub'
          alwaysPull true
          reuseNode true
        }
      }
      steps {
        script {
          def outputMap = terraformOutput('terraform/resources', 'sandbox-dev')
          outputMap.each { k, v -> println "$k := $v" }
          stageTerraformOutput['sandbox'] = outputMap
        }
      }
    } // END - terraform-sandbox resources output

    stage('build-webapp') {
      agent {
        docker {
          image "node:12.13.0"
          registryUrl ''
          registryCredentialsId 'docker-hub'
          alwaysPull true
          reuseNode true
        }
      }
      steps {
          sh "cd server/frontend && npm install && CI= npm run build"
      }
    } // END - build-webapp

    stage('package') {
      agent {
        docker {
          image "asuuto/ci-build:latest"
          args "-v /var/run/docker.sock:/var/run/docker.sock --group-add docker"
          registryUrl ''
          registryCredentialsId 'docker-hub'
          alwaysPull true
          reuseNode true
        }
      }      
      steps {
          sh "docker build --pull -t ${IMAGE_REGISTRY}:${IMAGE_TAG} server"
      }
    } // END - package

    stage('scan') {
      agent {
        docker {
          label 'docker'
          image 'asuuto/twistcli:latest'
          args "-v /var/run/docker.sock:/var/run/docker.sock --group-add docker"
          registryUrl ''
          registryCredentialsId 'docker-hub'
          alwaysPull true
          reuseNode true
        }
      }
      steps {
        script {
          scanImage("${IMAGE_REGISTRY}:${IMAGE_TAG}", TWISTLOCK_CONSOLE_URI, twistlock_secret.data.username, twistlock_secret.data.password)
        }
      }
    } // END - scan

    stage('publish') {
      when {
        anyOf {
           branch "${CAAS_SANDBOX_BRANCH}"; branch "${MASTER_BRANCH}"
        }
        beforeAgent true
        beforeInput true
      }
      agent {
        docker {
          image 'asuuto/ci-build:latest'
          args "-v /var/run/docker.sock:/var/run/docker.sock --group-add docker"
          registryUrl ''
          registryCredentialsId 'docker-hub'
          reuseNode true
        }
      }
      steps {
        pushImage("${IMAGE_REGISTRY}:${IMAGE_TAG}", AWS_ROLE, aws_account_id)
      }
    }// END - publish

    stage('deploy webapp sandbox') {
      when {
        anyOf {
           branch "${CAAS_SANDBOX_BRANCH}"; branch "${MASTER_BRANCH}"
        }
        beforeAgent true
        beforeInput true
      }
      agent {
        docker {
            reuseNode true
            image 'bootswithdefer/packer-ansible'
        }
      }
      steps {
        dir(path: 'server/frontend') {
          withAWS(role: AWS_ROLE, roleAccount: ASU_UTO_BCDL_SANDBOX) {
              sh """
              ls -lah
              aws s3 sync build s3://dlt-reverse-transfer-webapp-bucket --acl public-read --delete
              """
          }
        }
      }
    }

    stage('deploy-sandbox') {
      when {
        branch "${CAAS_SANDBOX_BRANCH}"
        beforeAgent true
        beforeInput true
      }
      input {
        message "Continue with sandbox deployment?"
        ok "Yes"
      }
      agent {
        docker {
          label 'docker'
          image 'asuuto/warapps-k8s-deploy:latest'
          args '-v /var/run/docker.sock:/var/run/docker.sock --group-add docker'
          registryUrl ''
          registryCredentialsId 'docker-hub'
          reuseNode true
        }
      }
      options {
        timeout(time: 60, unit: 'MINUTES')
      }
      steps {
        script {
          helmCaasDeployment(
            "sandbox", // lifecycle
            "${IMAGE_REGISTRY}:${IMAGE_TAG}", // image
            caas_vault_addr, // caas-vault-address
            jenkins_caas_vault_token, // caas-vault-token
            "dlt-reverse-transfer", // helm-release-name
            "helm/server", // helm-directory
            "helm/server/values-sandbox.yaml", // helm-values-file
            stageTerraformOutput['sandbox']['eks_namespace'], // kube-namespace
            stageTerraformOutput['sandbox']['service_account_role_arn'], // kube-serviceaccount-role
            stageTerraformOutput['sandbox']['vault_role_name'], // vault-app-role
            stageTerraformOutput['sandbox']['db_instance_endpoint'] // db_instance_endpoint generated by tf
          );
        }
      }
    } // END - deploy-sandbox

    stage('flyway-sandbox') {
      agent {
        docker {
          reuseNode true
          image 'quay.io/bootswithdefer/flyway'
        }
      }
      steps {
        script {
          def dbSecret = getVaultV1Secret(caas_vault_addr, 'services/dco/jenkins/dlt/reverse-transfer/dev/rttln/db/userpassword', jenkins_caas_vault_token)
          writeFile file: 'flyway.conf', text: "flyway.url=jdbc:postgresql://terraform-20210427155721746700000001.cfptgkgt0qle.us-west-2.rds.amazonaws.com:5432/postgres\nflyway.user=${dbSecret.data.user}\nflyway.password=${dbSecret.data.password}\n"
          sh 'cp flyway.conf /flyway/conf'
          sh 'cp sql/*.sql /flyway/sql'
          sh 'cat /flyway/sql/*'
          sh 'flyway migrate'
          sh 'flyway info'
        }
      }
    } //ENDS - flyway sandbox

  } // END - stages
}// END - groovy pipeline

def helmCaasDeployment(
    String lifecycle,
    String image,
    String caasVaultAddr,
    String caasVaultToken,
    String helmReleaseName,
    String helmDir,
    String helmValuesFile,
    String kubeNamespace,
    String kubeServiceAccount,
    String vaultAppRole,
    String db_instance_endpoint) {

  echo "Deploying image [${image}] to [${lifecycle}]..."
  echo 'Retrieving jenkins kube config...'
  sh """
    export VAULT_ADDR=${caasVaultAddr}
    set +x
    export VAULT_TOKEN=${caasVaultToken}
    set -x
    vault read -field=content secret/services/dco/jenkins/caas/eks/prod/kubernetes/principals/jenkins/kube.yml > kubeconfig.yml
    export KUBECONFIG=\$(pwd)/kubeconfig.yml
    echo 'Retrieving eks cluster info...'
    kubectl cluster-info
    echo 'Running helm upgrade ...'
    helm upgrade --install --atomic --create-namespace ${helmReleaseName} \$(pwd)/${helmDir} \
      --values \$(pwd)/${helmValuesFile} \
      --namespace=${kubeNamespace} \
      --set serviceAccount.eksRoleArn=${kubeServiceAccount} \
      --set vault.appRole=${vaultAppRole} \
      --set vault.addr=${caasVaultAddr} \
      --set dbEndpoint=${db_instance_endpoint} \
      --set image=${image}
  """
}


def scanImage(String image, String consoleUri, String username, String password) {
    echo "scanning image ${image}..."
    maskPasswords([[password: "${password}", var: 'password']]) {
        sh """
            twistcli images scan --address "${consoleUri}" --user "${username}" --password "${password}" \
                --output-file "${image}_scan.json" --publish --include-package-files --details \
                ${image}
        """
    }
}

def pushImage(String image, String role, String roleAccount) {
    echo "pushing image ${image}..."
    withAWS(role: role, roleAccount: roleAccount) {
        sh """
            echo 'ecr login...'
            \$(aws ecr get-login --registry-ids ${roleAccount} --no-include-email --region us-west-2)
            echo 'docker push...'
            docker push ${image}
        """
    }
}