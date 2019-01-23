class GameSerializer < ActiveModel::Serializer
  attributes :id, :title, :summary, :created_at
  belongs_to :user
  belongs_to :genre

  def created_at
    object.created_at.strftime("%a %m-%d-%Y")
  end
end
