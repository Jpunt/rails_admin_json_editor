# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'rails_admin_json_editor/version'

Gem::Specification.new do |spec|
  spec.name          = "rails_admin_json_editor"
  spec.version       = RailsAdminJsonEditor::VERSION
  spec.authors       = ["Jasper Haggenburg"]
  spec.email         = ["jasperh@q42.nl"]
  spec.summary       = "JSON-editor for RailsAdmin"
  spec.description   = "Define components and save them as JSON to a model. This is very much a work in progress, so be careful!"
  spec.homepage      = 'http://rubygems.org/gems/rails-admin-json-editor'
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.6"
  spec.add_development_dependency "rake", "~> 10.4"

  spec.add_runtime_dependency "rails_admin", "~> 0.6"
end
