pipeline {
    agent {
      docker {
        label "local"
        image "docker.hops.works/hopsworks-react-front:0.0.1"
        args '-v /opt/repository/master/hopsworks/frontend:/repo/'
      }
    }

    stages {
        stage("build and publish") {

           steps {
              sh """
                VERSION=`cat version.txt`
                QUARTZ_BRANCH=\$VERSION
                if [[ \$VERSION =~ .*-SNAPSHOT ]]
                then
                  QUARTZ_BRANCH="dev"
                else
                  QUARTZ_BRANCH="\${VERSION%.*}"
                fi
                echo "\$QUARTZ_BRANCH"
                
                export OLD_DIR=\$PWD
                cd /tmp
                # Build Quartz
                git clone https://github.com/logicalclocks/quartz
                cd quartz
                git checkout \$QUARTZ_BRANCH
                git log --max-count=1
                
                npm install
                npm link
                rm -rf node_modules/rebass node_modules/react node_modules/emotion-theming
               
        
                # Build Hopsworks-front
                cd \$OLD_DIR
                rm -rf node_modules

                # Install dependencies
                yarn install
                
                rm -rf node_modules/@logicalclocks/quartz
                npm link @logicalclocks/quartz

                # Prepare environment file for production 
                echo "REACT_APP_API_HOST=\"/hopsworks-api/api\"" > .env     

                # Build artifact
                yarn build
                
                # Generate build tgz
                cd build
                tar czf frontend.tgz *
                
                # Publish
                cp frontend.tgz /repo/\$VERSION/
              """
            }
        }
    }
}
