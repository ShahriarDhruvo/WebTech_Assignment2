# Serializers are nothing but a way to convert any python model into json data
# It means to convert the python model into json format by using serializer so that 
# we can pass that around to use in api

from rest_framework import serializers

from .models import Work, Task

# All WORK serializers
class WorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Work
        fields = '__all__'

class WorkUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Work
        fields = '__all__'
        read_only_fields = ['owner', 'collaborators']

class WorkUpdateCollaboratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Work
        fields = '__all__'
        read_only_fields = ['owner', 'title', 'completed']

# All TASK serializers
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields  = '__all__'

class TaskUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields  = '__all__'
        read_only_fields = ['work_name']

###########
class WorkStoreSerializer(serializers.ModelSerializer):

    task_set = TaskSerializer(many=True)

    class Meta:
        model = Work
        fields = '__all__'

    def create(self, validated_data):

        tasks_data = validated_data.pop('task_set')
        work = Work.objects.create(**validated_data)

        for task_data in tasks_data:
            Task.objects.create(transaction=transaction, **task_data)

        return work

class WorkShowSerializer(serializers.ModelSerializer):

    user = serializers.StringRelatedField()
	task_set = TaskSerializer(many=True)

    class Meta:
        model = Work
        fields = '__all__'
        read_only_fields = ['owner', 'collaborators']  