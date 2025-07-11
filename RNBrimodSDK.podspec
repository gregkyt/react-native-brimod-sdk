require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |spec|
  spec.name           = 'RNBrimodSDK'
  spec.version        = package['version']
  spec.summary        = package['summary']
  spec.description    = package['description']
  spec.homepage       = package['homepage']
  spec.license        = package['license']
  spec.author         = package['author']
  spec.platform       = :ios, "13.0"
  spec.source         = { :git => "https://github.com/gregkyt/react-native-brimod-sdk.git", :tag => "#{spec.version}" }
  
  spec.source_files   = 'ios/*.{swift,h,m,mm}'
  
  spec.swift_versions = ['5.0']
  
  spec.frameworks     = 'Foundation'
  
  # React Native dependencies
  spec.dependency "React"
  spec.dependency "React-Core"
  
  # Conditional dependencies for New Architecture
  if ENV['RCT_NEW_ARCH_ENABLED'] == '1'
    spec.compiler_flags = '-DRCT_NEW_ARCH_ENABLED=1'
    spec.pod_target_xcconfig = {
      'HEADER_SEARCH_PATHS' => '"$(PODS_ROOT)/boost" "$(PODS_ROOT)/boost-for-react-native" "$(PODS_ROOT)/RCT-Folly"',
      'CLANG_CXX_LANGUAGE_STANDARD' => 'c++17'
    }
    spec.dependency "React-RCTFabric"
    spec.dependency "React-Codegen" 
    spec.dependency "RCT-Folly"
    spec.dependency "RCTRequired"
    spec.dependency "RCTTypeSafety"
    spec.dependency "ReactCommon/turbomodule/core"
  end
end
